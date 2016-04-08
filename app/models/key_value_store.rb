# == Schema Information
#
# Table name: key_value_stores
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

# A global database backed key value store.
#
# Can store numbers, strings, booleans, date-times, arrays and hashes.
#
# For a "stronger" (permitted keys, validations) version of this key value
# store, see the {StrongKeyValueStore} module.
#
# Usage:
#   # Default store
#   KeyValueStore.set(some_key: some-object, ...)
#   KeyValueStore.get(:some_key) // some-object
#   KeyValueStore.get_all // { some_key: some-object }
#
#   # A named store
#   KeyValueStore[:some_name].set(some_key: some-object, ...)
#   KeyValueStore[:some_name].get(:some_key) // some-object
#   KeyValueStore[:some_name].get_all // { some_key: some-object }
class KeyValueStore < ActiveRecord::Base
  has_settings :default

  validates :name, presence: true

  # Gets a value.
  #
  # @param key [Symbol] the key
  #
  # @return [Object, nil] the value, or nil if not found
  def get (key)
    settings(:default).send(encode_key(key))
  end

  # Gets all keys and values.
  #
  # @return [Hash{Symbol => Object}]
  def get_all
    encoded_hash = settings(:default).value

    encoded_hash.transform_keys { |encoded_key| decode_key(encoded_key) }
  end

  # Sets value(s).
  #
  # @param hash [Hash{Symbol => Object}] the keys and values to set
  def set (hash)
    encoded_hash = hash.transform_keys { |key| encode_key(key) }

    settings(:default).update_attributes!(encoded_hash)
  end

  # Clears any existing value(s), and sets the given one(s) instead.
  #
  # @param hash [Hash{Symbol => Object}] the keys and values to set, or nil or
  #   {} to merely clear existing values
  def clear_and_set (hash)
    full_hash = get_all.transform_values! { |value| nil }.merge(hash || {})

    set(full_hash)
  end

  # Gets a named store, creating one first if it does not exist yet.
  # Note: Supplying :default will fetch the default store.
  #
  # @param name [Symbol] the name
  #
  # @return [KeyValueStore]
  def self.[] (name)
    name_str = name.to_s

    KeyValueStore.where(name: name_str).first_or_create(name: name_str)
  end

  private

  # Encodes a key, to prevent name clashes with standard model attributes.
  #
  # @param key [Symbol] the key to encode
  #
  # @return [String] the encoded key
  def encode_key (key)
    "kvs__#{key}__"
  end

  # Decodes an encoded key.
  #
  # @param encoded_key [String] a key encoded by {#encode_key}
  #
  # @return [Symbol] the decoded key
  def decode_key (encoded_key)
    encoded_key[5..-3].to_sym
  end

  # Gets a value.
  # Operates on the default store.
  #
  # @param key [Symbol] the key
  #
  # @return [Object, nil] the value, or nil if not found
  def self.get (key)
    KeyValueStore[:default].get(key)
  end

  # Gets all keys and values.
  # Operates on the default store.
  #
  # @return [Hash{Symbol => Object}]
  def self.get_all
    KeyValueStore[:default].get_all
  end

  # Sets value(s).
  # Operates on the default store.
  #
  # @param hash [Hash{Symbol => Object}] the keys and values to set
  def self.set (hash)
    KeyValueStore[:default].set(hash)
  end

  # Clears any existing value(s), and sets the given one(s) instead.
  # Operates on the default store.
  #
  # @param hash [Hash{Symbol => Object}] the keys and values to set, or nil or
  #   {} to merely clear existing values
  def self.clear_and_set (hash)
    full_hash = get_all.transform_values! { |value| nil }.merge(hash || {})

    set(full_hash)
  end
end
