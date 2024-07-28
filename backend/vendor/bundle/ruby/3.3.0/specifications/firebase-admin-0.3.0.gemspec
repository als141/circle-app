# -*- encoding: utf-8 -*-
# stub: firebase-admin 0.3.0 ruby lib

Gem::Specification.new do |s|
  s.name = "firebase-admin".freeze
  s.version = "0.3.0".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Colin Harris".freeze]
  s.date = "2022-09-29"
  s.description = "A Ruby wrapper for the Firebase Admin APIs".freeze
  s.email = ["colin@jiva.ag".freeze]
  s.homepage = "https://github.com/col/firebase-admin".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new("> 2.7".freeze)
  s.rubygems_version = "3.2.3".freeze
  s.summary = "Ruby wrapper for the Firebase Admin APIs".freeze

  s.installed_by_version = "3.5.16".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_development_dependency(%q<rake>.freeze, ["~> 13.0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, ["~> 3.10".freeze])
  s.add_development_dependency(%q<rubocop>.freeze, ["~> 1.9".freeze])
  s.add_development_dependency(%q<webmock>.freeze, ["~> 3.11".freeze])
  s.add_runtime_dependency(%q<addressable>.freeze, ["~> 2.7".freeze])
  s.add_runtime_dependency(%q<faraday>.freeze, ["~> 1.3".freeze])
  s.add_runtime_dependency(%q<faraday_middleware>.freeze, ["~> 1.0".freeze])
  s.add_runtime_dependency(%q<hashie>.freeze, ["~> 4.1".freeze])
  s.add_runtime_dependency(%q<multi_json>.freeze, ["~> 1.15".freeze])
  s.add_runtime_dependency(%q<jwt>.freeze, [">= 2.2".freeze])
end
