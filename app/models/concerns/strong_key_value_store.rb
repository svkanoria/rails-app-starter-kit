# A "strong" key value store, backed by a regular {KeyValueStore}.
#
# Adds the ability to define permissible keys, and to define validations via
# the functionality provided by the ActiveModel::Validations module.
#
# Usage:
#   class SomeClass
#     :
#     include StrongKeyValueStore
#
#     strong_key_value_store keys: [:key1, :key2, ...]
#
#     # Validations, precisely as one would define in any ActiveRecord model
#     validates :key1, presence: true
#     validates :key2, numericality: { minimum: 10, maximum: 100 }
#       :
#     :
#   end
#
#   # Get the strong key value store
#   SomeClass.instance
#
#   # Get a value from the strong key value store
#   SomeClass.instance.key1
#
#   # Set and persist values. This is designed to mimic ActiveRecord, to offer
#   # some degree of interoperability. However, it offers just a tiny subset of
#   # ActiveRecord's persistence methods.
#
#   store = SomeClass.instance
#   store.key1 = "some-value"
#   store.key2 = 30
#   store.save
#   # -- OR --
#   store = SomeClass.instance
#   store.update_attributes key1: "some-value", key2: 30
module StrongKeyValueStore
  extend ActiveSupport::Concern

  include ActiveModel::Validations

  included do
    @strong_kvs_opts = {}
  end

  # Saves any changes to the backing store.
  #
  # Works just like ActiveRecord::Persistence#save.
  def save
    if valid?
      hash = {}

      self.class.permitted_keys.each do |key|
        hash[key] = self.send(key)
      end

      self.class.underlying_raw_kvs.set(hash)
    else
      false
    end
  end

  # Updates specified attributes (keys) in the backing store.
  #
  # Works just like ActiveRecord::Persistence#update_attributes.
  def update_attributes (hash)
    self.class.permitted_keys.each do |key|
      self.send("#{key}=", hash[key])
    end

    save
  end

  module ClassMethods
    # The permitted keys.
    #
    # @return [Array<Symbol>]
    def permitted_keys
      @strong_kvs_opts[:keys] || []
    end

    # Sets the strong key value store's options.
    #
    # @param opts [Hash] as follows:
    #   { keys: [:key1, :key2, ...] }
    def strong_key_value_store (opts = {})
      @strong_kvs_opts.merge!(opts)

      attr_accessor *permitted_keys
    end

    # The underlying "raw" key value store backing this strong key value store.
    #
    # Ideally, this should never be called from outside this module.
    #
    # @return [KeyValueStore]
    def underlying_raw_kvs
      KeyValueStore["__#{self.name}"]
    end

    # The singleton instance of this strong key value store.
    #
    # The instance returned is the *last successfully saved* one, and does not
    # contain any as yet unsaved values, which will be lost. So in effect, this
    # behaves like ActiveRecord::Base#first.
    #
    # A better name for this method may have been 'fetch', but in the spirit of
    # mimicking ActiveRecord, we stuck with 'instance' to stay faithful to how
    # several gems have implemented ActiveRecord singleton behaviour.
    #
    # @return [Object] the singleton instance of the including class
    def instance
      instance = self.new

      hash = underlying_raw_kvs.get_all

      permitted_keys.each { |key| instance.send("#{key}=", hash[key]) }

      instance
    end
  end
end
