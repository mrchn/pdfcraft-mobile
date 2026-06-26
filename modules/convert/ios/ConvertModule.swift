// @/modules/convert/ConvertModule.swift (pdfcraft-mobile)

import ExpoModulesCore
import WebKit

public class ConvertModule: Module {
	private var webView: WKWebView?
	private var currentDelegate: NavigationDelegate?
	public func definition() -> ModuleDefinition {
		Name("Convert")

		AsyncFunction("convert") { (
			docxPath: String, outputPath: String, promise: Promise
		) in
			DispatchQueue.main.async {
				let docxUrl = URL(fileURLWithPath: docxPath)
				let outputUrl = URL(fileURLWithPath: outputPath)

				self.webView = WKWebView(
					frame: CGRect(
						x: 0, y: 0,
						width: 816, height: 1056
					)
				)
				self.webView?.loadFileURL(
					docxUrl,
					allowingReadAccessTo:
						docxUrl.deletingLastPathComponent()
				)
				let delegate = NavigationDelegate(
					outputUrl: outputUrl,
					promise: promise
				) { [weak self] in
					self?.webView = nil
					self?.currentDelegate = nil

				}
				self.currentDelegate = delegate
				self.webView?.navigationDelegate = delegate
			}
		}
	}
}

class NavigationDelegate: NSObject, WKNavigationDelegate {
	let outputUrl: URL
	let promise: Promise
	let onComplete: () -> Void
	
	init(
		outputUrl: URL,
		promise: Promise,
		onComplete: @escaping () -> Void
	) {
		self.outputUrl = outputUrl
		self.promise = promise
		self.onComplete = onComplete
	}
	
	func webView(
		_ webView: WKWebView,
		didFinish navigation: WKNavigation!
	) {
		if #available(iOS 14.5, *) {
			let config = WKPDFConfiguration()
			webView.createPDF(configuration: config) {
				[weak self] result in
				guard let self = self else { return }
				switch result {
					case .success(let data):
						do {
							try data.write(to: self.outputUrl)
							self.promise.resolve(true)
						} catch { self.promise.resolve(false) }
					case .failure: self.promise.resolve(false)
				}
				self.onComplete()
			}
		} else {
			self.promise.resolve(false)
			self.onComplete()
		}
	}
	
	func webView(
		_ webView: WKWebView,
		didFail navigation: WKNavigation!,
		withError error: Error
	) {
		self.promise.resolve(false)
		self.onComplete()
	}
	func webView(
		_ webView: WKWebView,
		didFailProvisionalNavigation navigation: WKNavigation!,
		withError error: Error
	) {
		self.promise.resolve(false)
		self.onComplete()
	}
}