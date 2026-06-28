# @/modules/ios-native-convert/IosNativeConvert.podspec

Pod::Spec.new do |s|
  s.name           = 'IosNativeConvert'
  s.version        = '0.1.0'
  s.summary        = 'webkit pdf convert'
  s.description    = 'a native webkit pdf converter'
  s.author         = 'mrchn'
  s.homepage       = 'https://github.com/mrchn/pdfcraft-mobile'
  s.license        = { :type => 'MIT' }
  s.platform       = :ios, '15.1'
  s.source         = { :path => '.' }
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES'
  }
  s.source_files = "ios/**/*.{h,m,mm,swift}"
end