# -*- encoding: utf-8 -*-
# stub: grpc 1.65.2 x86_64-linux src/ruby/lib src/ruby/bin src/ruby/pb

Gem::Specification.new do |s|
  s.name = "grpc".freeze
  s.version = "1.65.2".freeze
  s.platform = "x86_64-linux".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["src/ruby/lib".freeze, "src/ruby/bin".freeze, "src/ruby/pb".freeze]
  s.authors = ["gRPC Authors".freeze]
  s.bindir = "src/ruby/bin".freeze
  s.date = "2024-07-26"
  s.description = "Send RPCs from Ruby using GRPC".freeze
  s.email = "grpc-io@googlegroups.com".freeze
  s.homepage = "https://github.com/google/grpc/tree/master/src/ruby".freeze
  s.licenses = ["Apache-2.0".freeze]
  s.required_ruby_version = Gem::Requirement.new([">= 2.7".freeze, "< 3.4.dev".freeze])
  s.rubygems_version = "3.5.16".freeze
  s.summary = "GRPC system in Ruby".freeze

  s.installed_by_version = "3.5.16".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<google-protobuf>.freeze, [">= 3.25".freeze, "< 5.0".freeze])
  s.add_runtime_dependency(%q<googleapis-common-protos-types>.freeze, ["~> 1.0".freeze])
  s.add_development_dependency(%q<bundler>.freeze, [">= 1.9".freeze])
  s.add_development_dependency(%q<facter>.freeze, ["~> 2.4".freeze])
  s.add_development_dependency(%q<logging>.freeze, ["~> 2.0".freeze])
  s.add_development_dependency(%q<simplecov>.freeze, ["~> 0.22".freeze])
  s.add_development_dependency(%q<rake>.freeze, ["~> 13.0".freeze])
  s.add_development_dependency(%q<rake-compiler>.freeze, ["~> 1.2.1".freeze])
  s.add_development_dependency(%q<rake-compiler-dock>.freeze, ["~> 1.4".freeze])
  s.add_development_dependency(%q<rspec>.freeze, ["~> 3.6".freeze])
  s.add_development_dependency(%q<rubocop>.freeze, ["~> 1.41.0".freeze])
  s.add_development_dependency(%q<signet>.freeze, ["~> 0.7".freeze])
  s.add_development_dependency(%q<googleauth>.freeze, ["~> 1.0".freeze])
end
