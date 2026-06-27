# @/modules/ios-native-convert/ios-native-convert.podspec

Pod::Spec.new do |s|
  s.name           = 'ios-native-convert'
  s.version        = '0.1.0'
  s.summary        = 'webkit pdf convert'
  s.description    = 'a native webkit pdf converter'
  s.author         = 'mrchn'
  s.platform       = :ios, '15.1'
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
end