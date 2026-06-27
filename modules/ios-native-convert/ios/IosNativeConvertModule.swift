// @/modules/ios-native-convert/ios/IosNativeConvertModule.swift

import ExpoModulesCore
import WebKit

public class IosNativeConvertModule: Module {
	private var webView: WKWebView?
	private var currentDelegate: NavigationDelegate?
	public func definition() -> ModuleDefinition {
		Name("IosNativeConvert")

		AsyncFunction("convert") { (
			docxPath: String, outputPath: String, promise: Promise
		) in
			DispatchQueue.main.async {
				let docxUrl = URL(fileURLWithPath: docxPath)
				let outputUrl = URL(fileURLWithPath: outputPath)

				self.webView = WKWebView(
					frame: CGRect(
						x: 0, y: 0, width: 816, height: 1056
					)
				)

				let delegate = NavigationDelegate(
					outputUrl: outputUrl, promise: promise
				) { [weak self] in
					self?.webView = nil
					self?.currentDelegate = nil

				}
				self.currentDelegate = delegate
				self.webView?.navigationDelegate = delegate

				self.webView?.loadFileURL(
					docxUrl,
					allowingReadAccessTo:
						docxUrl.deletingLastPathComponent()
				)
			}
		}
	}
}

class NavigationDelegate: NSObject, WKNavigationDelegate {
	let outputUrl: URL
	let promise: Promise
	let onComplete: () -> Void
	
	init(
		outputUrl: URL, promise: Promise,
		onComplete: @escaping () -> Void
	) {
		self.outputUrl = outputUrl ; self.promise = promise
		self.onComplete = onComplete
	}
	
	func webView(
		_ webView: WKWebView, didFinish navigation: WKNavigation!
	) {
		guard #available(iOS 14.5, *) else { return fail() }
		DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
			[weak self] in
			guard let self = self else { return }

			webView.createPDF(configuration: WKPDFConfiguration()) {
				[weak self] result in
				guard let self = self else { return }
				switch result {
					case .success(let data): self.promise.resolve(
						(try? data.write(to: self.outputUrl)) != nil
					)
					case .failure: self.promise.resolve(false)
				}
				self.onComplete()
			}
		}
	}

	private func fail() { promise.resolve(false); onComplete() }
	
	func webView(
		_ w: WKWebView, didFail n: WKNavigation!, withError e: Error
	) { fail() }
	func webView(
		_ w: WKWebView, didFailProvisionalNavigation n: WKNavigation!,
		withError e: Error
	) { fail() }
}