# -*- encoding: utf-8 -*-
# stub: gapic-common 0.22.0 ruby lib

Gem::Specification.new do |s|
  s.name = "gapic-common".freeze
  s.version = "0.22.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Google API Authors".freeze]
  s.date = "2024-07-22"
  s.email = ["googleapis-packages@google.com".freeze]
  s.homepage = "https://github.com/googleapis/gapic-generator-ruby".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 3.0".freeze)
  s.rubygems_version = "3.5.6".freeze
  s.summary = "Common code for GAPIC-generated API clients".freeze

  s.installed_by_version = "3.5.16".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<faraday>.freeze, [">= 1.9".freeze, "< 3.a".freeze])
  s.add_runtime_dependency(%q<faraday-retry>.freeze, [">= 1.0".freeze, "< 3.a".freeze])
  s.add_runtime_dependency(%q<googleapis-common-protos>.freeze, ["~> 1.6".freeze])
  s.add_runtime_dependency(%q<googleapis-common-protos-types>.freeze, ["~> 1.15".freeze])
  s.add_runtime_dependency(%q<googleauth>.freeze, ["~> 1.11".freeze])
  s.add_runtime_dependency(%q<google-protobuf>.freeze, [">= 3.25".freeze, "< 5.a".freeze])
  s.add_runtime_dependency(%q<grpc>.freeze, ["~> 1.65".freeze])
end
