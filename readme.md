# Konkan Design System Tokens

This is a monorepo containing Konkan Design System tokens. It stores tokens in various formats for multiple frontend environments, primary mobile (SwiftUI and Kotlin) and web (CSS).

## Using JSON tokens

If you are developing an application and want to consume Konkan Design Tokens, the best place to start is the `/dist` directory which contains all our tokens. Token structure is documented in our RFCs, which are published under Discussions.

### Currently available tokens:

- [Colours](https://github.com/matthewmorek/konkan-design-system/discussions/61) [live]
- [Typography](https://github.com/matthewmorek/konkan-design-system/discussions/51) [live]
- [Spacing](https://github.com/matthewmorek/konkan-design-system/discussions/52) [live]

### CSS

To use Konkan tokens in CSS, you can import CSS with variables directly into your application. This is the recommended way of using tokens in CSS. Here's a short example:

```css
@import url("https://raw.githubusercontent.com/matthewmorek/konkan-design-system/main/dist/toyota-light.css");

body {
  background-color: var(---semantic-color-background-neutral-bottom);
  color: var(--semantic-color-foreground-on-neutral-strong);
  font-family: var(--semantic-text-body-medium-regular-font-family);
  font-size: var(--semantic-text-body-medium-regular-font-size);
  font-weight: var(--semantic-text-body-medium-regular-font-weight);
  line-height: var(--semantic-text-body-medium-regular-line-height);
  letter-spacing: var(--semantic-text-body-medium-regular-letter-spacing);
}
```

## Maintainance

If you want to contribute to the maintenance of this package, below you'll find some tips on what it does and where to start.

### Requirements

- Node.js 18+
- Node.js package manager (Yarn, npm, pnpm, etc)
- Familiarity with [Style Dictionary](https://amzn.github.io/style-dictionary/#/)
- Familiarity with [Tokens Studio](https://docs.tokens.studio/transforming/style-dictionary)

If you did everything correctly, you should see a message like this in your terminal, and the tokens should be up-to-date in Supernova.

```
Tokens synchronized
```

### Building JSON tokens

We currently run a GitHub Action which automatically builds and commits built JSON tokens to each PR branch before each merge. This is an automated check to ensure consistency of output between what's in Tokens Studio (Figma) and what's available for engineering teams. If you want to build tokens locally, follow these steps:

1. Install required dependencies with your package manager (npm, pnpm, yarn, etc)
2. Run build command `npm run build:tokens`
3. You can manually commit any changes.

> [!NOTE]
> The automated build process on CI will skip its own commit if the build doesn't produce any differences in JSON code.
