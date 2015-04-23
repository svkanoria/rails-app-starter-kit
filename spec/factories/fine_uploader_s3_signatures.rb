FactoryGirl.define do
  # Factory for generating params to be sent to the
  # 'fine_uploader#s3_signature' action.
  factory :fine_uploader_s3_signature, class: Hash do
    expiration 1.year.from_now

    conditions {{
      'acl' => 'private',
      'bucket' => 'some-bucket',
      'Content-Type' => 'image/jpeg',
      'success_action_status' => '200',
      'key' => 'some-file-key.jpg',
      'x-amz-meta-qqfilename' => 'some-file-name.jpg'
    }}

    initialize_with { attributes }
  end
end
