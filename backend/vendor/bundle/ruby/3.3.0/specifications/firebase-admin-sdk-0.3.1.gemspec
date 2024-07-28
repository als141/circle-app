# -*- encoding: utf-8 -*-
# stub: firebase-admin-sdk 0.3.1 ruby lib

Gem::Specification.new do |s|
  s.name = "firebase-admin-sdk".freeze
  s.version = "0.3.1".freeze

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Tariq Zaid".freeze]
  s.date = "2023-11-02"
  s.email = ["tariq@cheddar.me".freeze]
  s.homepage = "https://github.com/cheddar-me/firebase-admin-sdk-ruby".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new("> 2.7".freeze)
  s.rubygems_version = "3.4.21".freeze
  s.summary = "Firebase Admin SDK for Ruby".freeze

  s.installed_by_version = "3.5.16".freeze if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_runtime_dependency(%q<googleauth>.freeze, ["> 0.16".freeze, "< 2.0".freeze])
  s.add_runtime_dependency(%q<faraday>.freeze, ["> 1".freeze, "< 3".freeze])
  s.add_runtime_dependency(%q<jwt>.freeze, [">= 1.5".freeze, "< 3.0".freeze])
  s.add_runtime_dependency(%q<google-apis-fcm_v1>.freeze, [">= 0.19.0".freeze, "< 1.0".freeze])
  s.add_development_dependency(%q<rake>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<rspec>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<webmock>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<fakefs>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<climate_control>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<standard>.freeze, [">= 0".freeze])
  s.add_development_dependency(%q<activesupport>.freeze, ["~> 7.0.8".freeze])
end
