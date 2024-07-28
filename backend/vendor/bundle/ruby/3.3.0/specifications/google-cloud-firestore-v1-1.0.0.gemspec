# -*- encoding: utf-8 -*-
# stub: google-cloud-firestore-v1 1.0.0 ruby lib

Gem::Specification.new do |s|
  s.name = "google-cloud-firestore-v1".freeze
  s.version = "1.0.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Google LLC".freeze]
  s.date = "2024-07-09"
  s.description = "Cloud Firestore is a NoSQL document database built for automatic scaling, high performance, and ease of application development. Note that google-cloud-firestore-v1 is a version-specific client library. For most uses, we recommend installing the main client library google-cloud-firestore instead. See the readme for more details.".freeze
  s.email = "googleapis-packages@google.com".freeze
  s.homepage = "https://github.com/googleapis/google-cloud-ruby".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.7".freeze)
  s.rubygems_version = "3.5.6".freeze
  s.summary = "Accesses the NoSQL document database built for automatic scaling, high performance, and ease of application development.".freeze

  s.installed_by_version = "3.5.16".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<gapic-common>.freeze, [">= 0.21.1".freeze, "< 2.a".freeze])
  s.add_runtime_dependency(%q<google-cloud-errors>.freeze, ["~> 1.0".freeze])
  s.add_runtime_dependency(%q<google-cloud-location>.freeze, [">= 0.7".freeze, "< 2.a".freeze])
end
