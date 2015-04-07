FactoryGirl.define do
  # Factory for generating params to be sent to the
  # 'fine_uploader#s3_upload_success' action.
  factory :fine_uploader_s3_upload_success, class: Hash do
    key 'some-key.jpg'
    uuid 'some-key'
    name 'some-file-name.jpg'
    bucket 'some-bucket'
    etag 'some-etag'

    initialize_with { attributes }
  end
end
