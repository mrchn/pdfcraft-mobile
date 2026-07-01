// @/craft/ooxml2html

const capture = (re: RegExp, t: string) => t.match(re)?.[1] ?? ''

const unescXML = (s: string) => { return s
	.replace(/&amp;/g, '&')
	.replace(/&lt;/g, '<')
	.replace(/&gt;/g, '>')
}

const escHTML = (s: string) => { return s
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
}

const regexCache = new Map<string, RegExp>()
const tagRegex = (tag: string) => {
	if (!regexCache.has(tag)) {
		regexCache.set(tag, new RegExp(`<w:${tag}\\b[^>]*/?>`))
	}
	return regexCache.get(tag)!
}

const isOn = (tag: string, scope: string) => {
	const m = scope.match(tagRegex(tag))
	if (!m) return false
	const val = m[0].match(/w:val="([^"]+)"/)?.[1]
	return val === undefined
		|| !['0', 'false', 'off', 'none'].includes(val)
}

export function ooxml_to_html (xml: string): string {
	//console.log('XML_DUMP:', xml.substring(0, 1000))
	const out: string[] = []
	const matches = xml.matchAll(
		/(<w:tbl[ >][\s\S]*?<\/w:tbl>)|(<w:p[ >][\s\S]*?<\/w:p>)/g
	)
	let inList = false

	const styleAlignMap: Record<string, string> = {
		'Заглавие': 'center', 'Надпись': 'center',
		'Title': 'center', 'Subtitle': 'center',
		'Heading1': 'center', 'Heading2': 'center'
	}

	for (const [, tbl, para] of matches) {
		if (tbl) {
			if (inList) { out.push('</ul>') ; inList = false }
			let rows = ''
			for (const [row] of tbl.matchAll(
				/<w:tr[ >][\s\S]*?<\/w:tr>/g
			)) {
				let cells = ''
				for (const [cell] of row.matchAll(
					/<w:tc[ >][\s\S]*?<\/w:tc>/g
				)) {
					const text = [...cell.matchAll(
						/<w:t[^>]*>([\s\S]*?)<\/w:t>/g
					)].map(m => m[1]).join('')

					cells +=	`<td style="border:1px solid #999;` +
								`padding:6px">${text}</td>`
				}
				rows += `<tr>${cells}</tr>`
			}
			out.push(
				`<table style="border-collapse:collapse;` +
				`width:100%;margin-bottom:12px">${rows}</table>`
			)
		}
		else if (para) {
			const pPr = para.match(
				/<w:pPr[^>]*>([\s\S]*?)<\/w:pPr>/i
			)?.[0] ?? ''
			const jcMatch = para.match(/<w:jc[^>]*w:val="([^"]+)"/i)
			const jc = jcMatch ? jcMatch[1] : ''
			const isList = /<w:numPr/.test(pPr)
			if (isList && !inList) {
				out.push(
					`<ul style="margin-top:0;` +
					`margin-bottom:12px;padding-left:20px">`
				)
				inList = true
			} else if (!isList && inList) {
				out.push('</ul>') ; inList = false
			}

			const style = capture(/<w:pStyle w:val="([^"]+)"/, pPr)
			const indLeft = capture(
				/<w:ind[^>]*w:(?:left|start)="(\d+)"/, pPr
			)

			let textAlign = (jc === 'center') ? 'center'
				: (jc === 'right') ? 'right'
				: (jc === 'both') ? 'justify'
				: jc ? '' : styleAlignMap[style] || ''

			let content = ''
			for (const [run] of para.matchAll(
				/<w:r[ >][\s\S]*?<\/w:r>/g
			)) {
				const rPr = run.match(
					/<w:rPr[ >][\s\S]*?<\/w:rPr>/
				)?.[0] ?? ''

				const bold = isOn('b', rPr)
				const italic = isOn('i', rPr)
				const underline = isOn('u', rPr)
				const sz = rPr.match(/<w:sz w:val="(\d+)"/)?.[1]
				const font = rPr.match(
					/<w:rFonts[^>]+w:ascii="([^"]+)"/
				)?.[1] || rPr.match(
					/<w:rFonts[^>]+w:hAnsi="([^"]+)"/
				)?.[1]

				let t = '' ; let preserveSpace = false
				for (const match of run.matchAll(
					/<w:t([^>]*)>([\s\S]*?)<\/w:t>|<w:br[^>]*>/g
				)) {
					if (match[0].startsWith('<w:br')) {
						t += '<br>'
					}
					else if (match[0].startsWith('<w:tab')) {
						t += '&emsp;'
					}
					else {
						if (/xml:space="preserve"/.test(
							match[1] || ''
						)) { preserveSpace = true }
						t += escHTML(unescXML(match[2] || ''))
					}
				}
				if (!t) continue
				const runStyles = []
				if (font) runStyles.push(`font-family:'${font}'`)
				if (sz) runStyles.push( // FONT-SIZE
					`font-size:${parseInt(sz, 10) / 2}pt`
				)
				if (underline) runStyles.push(
					`text-decoration:underline`
				)
				if (preserveSpace) runStyles.push(
					`white-space:pre-wrap`
				)
				if (runStyles.length > 0) {
					t = `<span style="${runStyles.join(';')}">` +
						`${t}</span>`
				}
				if (bold) t = `<b>${t}</b>`
				if (italic) t = `<i>${t}</i>`
				content += t
			}
			if (!content.trim()) { out.push('<p></p>') ; continue }

			const tag = isList ? 'li'
				: /^Heading1$/.test(style) ? 'h1'
				: /^Heading2$/.test(style) ? 'h2' : 'p'

			const cssStyles = []
			if (textAlign) cssStyles.push(`text-align:${textAlign}`)
			cssStyles.push('display:block', 'width:100%')

			if (isList) {
				const ilvl = pPr.match(/<w:ilvl w:val="(\d+)"/)?.[1]
				if (ilvl && ilvl !== '0') {
					cssStyles.push(
						`margin-left:${parseInt(ilvl, 10) * 20}px`
					)
				}
			} else if (indLeft) {
				const px = Math.round(parseInt(indLeft, 10) / 15)
				if (px > 0) cssStyles.push(`margin-left:${px}px`)
			}

			const styleAttr = cssStyles.length
				? ` style="${cssStyles.join(';')}"` : ''
			out.push(`<${tag}${styleAttr}>${content}</${tag}>`)
		}
	} if (inList) out.push('</ul>') ; return out.join('')
}