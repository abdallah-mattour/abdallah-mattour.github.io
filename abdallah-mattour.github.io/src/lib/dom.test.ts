import { copyText, openLink, scrollToSection } from './dom'

describe('dom helpers', () => {
  it('falls back to a hidden textarea when the Clipboard API is blocked', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) }, configurable: true })
    const exec = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', { value: exec, configurable: true })
    await expect(copyText('hi')).resolves.toBe(true)
    expect(exec).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
  })

  it('opens links in a new tab without leaving elements behind', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    openLink('https://example.com')
    expect(click).toHaveBeenCalled()
    expect(document.querySelector('a[href="https://example.com"]')).toBeNull()
    click.mockRestore()
  })

  it('scrolls to a section if it exists', () => {
    document.body.innerHTML = '<section id="x"></section>'
    scrollToSection('x')
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled()
    scrollToSection('missing')
  })
})
