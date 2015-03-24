# Authorization policy for Fine Uploader controller actions.
class FineUploaderPolicy < Struct.new(:user, :obj)
  def s3_signature?
    user && user.id
  end

  def s3_upload_success?
    user && user.id
  end
end
