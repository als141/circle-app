# frozen_string_literal: true
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/cloud/location/locations.proto

require 'google/protobuf'

require 'google/api/annotations_pb'
require 'google/protobuf/any_pb'
require 'google/api/client_pb'


descriptor_data = "\n%google/cloud/location/locations.proto\x12\x15google.cloud.location\x1a\x1cgoogle/api/annotations.proto\x1a\x19google/protobuf/any.proto\x1a\x17google/api/client.proto\"[\n\x14ListLocationsRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0e\n\x06\x66ilter\x18\x02 \x01(\t\x12\x11\n\tpage_size\x18\x03 \x01(\x05\x12\x12\n\npage_token\x18\x04 \x01(\t\"d\n\x15ListLocationsResponse\x12\x32\n\tlocations\x18\x01 \x03(\x0b\x32\x1f.google.cloud.location.Location\x12\x17\n\x0fnext_page_token\x18\x02 \x01(\t\"\"\n\x12GetLocationRequest\x12\x0c\n\x04name\x18\x01 \x01(\t\"\xd7\x01\n\x08Location\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x13\n\x0blocation_id\x18\x04 \x01(\t\x12\x14\n\x0c\x64isplay_name\x18\x05 \x01(\t\x12;\n\x06labels\x18\x02 \x03(\x0b\x32+.google.cloud.location.Location.LabelsEntry\x12&\n\x08metadata\x18\x03 \x01(\x0b\x32\x14.google.protobuf.Any\x1a-\n\x0bLabelsEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\x32\xa4\x03\n\tLocations\x12\xab\x01\n\rListLocations\x12+.google.cloud.location.ListLocationsRequest\x1a,.google.cloud.location.ListLocationsResponse\"?\x82\xd3\xe4\x93\x02\x39\x12\x14/v1/{name=locations}Z!\x12\x1f/v1/{name=projects/*}/locations\x12\x9e\x01\n\x0bGetLocation\x12).google.cloud.location.GetLocationRequest\x1a\x1f.google.cloud.location.Location\"C\x82\xd3\xe4\x93\x02=\x12\x16/v1/{name=locations/*}Z#\x12!/v1/{name=projects/*/locations/*}\x1aH\xca\x41\x14\x63loud.googleapis.com\xd2\x41.https://www.googleapis.com/auth/cloud-platformBo\n\x19\x63om.google.cloud.locationB\x0eLocationsProtoP\x01Z=google.golang.org/genproto/googleapis/cloud/location;location\xf8\x01\x01\x62\x06proto3"

pool = Google::Protobuf::DescriptorPool.generated_pool

begin
  pool.add_serialized_file(descriptor_data)
rescue TypeError
  # Compatibility code: will be removed in the next major version.
  require 'google/protobuf/descriptor_pb'
  parsed = Google::Protobuf::FileDescriptorProto.decode(descriptor_data)
  parsed.clear_dependency
  serialized = parsed.class.encode(parsed)
  file = pool.add_serialized_file(serialized)
  warn "Warning: Protobuf detected an import path issue while loading generated file #{__FILE__}"
  imports = [
    ["google.protobuf.Any", "google/protobuf/any.proto"],
  ]
  imports.each do |type_name, expected_filename|
    import_file = pool.lookup(type_name).file_descriptor
    if import_file.name != expected_filename
      warn "- #{file.name} imports #{expected_filename}, but that import was loaded as #{import_file.name}"
    end
  end
  warn "Each proto file must use a consistent fully-qualified name."
  warn "This will become an error in the next major version."
end

module Google
  module Cloud
    module Location
      ListLocationsRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("google.cloud.location.ListLocationsRequest").msgclass
      ListLocationsResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("google.cloud.location.ListLocationsResponse").msgclass
      GetLocationRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("google.cloud.location.GetLocationRequest").msgclass
      Location = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("google.cloud.location.Location").msgclass
    end
  end
end
