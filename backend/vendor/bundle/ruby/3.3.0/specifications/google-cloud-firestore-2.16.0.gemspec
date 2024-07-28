# -*- encoding: utf-8 -*-
# stub: google-cloud-firestore 2.16.0 ruby lib

Gem::Specification.new do |s|
  s.name = "google-cloud-firestore".freeze
  s.version = "2.16.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Google Inc".freeze]
  s.date = "2024-07-09"
  s.description = "google-cloud-firestore is the official library for Google Cloud Firestore API.".freeze
  s.email = "googleapis-packages@google.com".freeze
  s.homepage = "https://github.com/googleapis/google-cloud-ruby/tree/master/google-cloud-firestore".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.7".freeze)
  s.rubygems_version = "3.5.6".freeze
  s.summary = "API Client library for Google Cloud Firestore API".freeze

  s.installed_by_version = "3.5.16".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<bigdecimal>.freeze, ["~> 3.0".freeze])
  s.add_runtime_dependency(%q<concurrent-ruby>.freeze, ["~> 1.0".freeze])
  s.add_runtime_dependency(%q<google-cloud-core>.freeze, ["~> 1.5".freeze])
  s.add_runtime_dependency(%q<google-cloud-firestore-v1>.freeze, [">= 0.10".freeze, "< 2.a".freeze])
  s.add_runtime_dependency(%q<rbtree>.freeze, ["~> 0.4.2".freeze])
end
