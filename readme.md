# Konkan UI – Flutter

This package makes tokens, components, and modules from the Konkan Design system available to Flutter apps.

## Getting started

To install Konkan UI in your Flutter project:

1. Open your `pubspec.yaml` file inside an `app` directory and add `konkan_ui` under `dependencies` .

```yaml
dependencies:
  konkan_ui:
    git: https://github.com/matthewmorek/konkan-ui.git
    path: flutter
```

1. Install it:
   - From the terminal run `flutter pub get`.
   - From Android Studio/IntelliJ: Click **Packages get** in the action ribbon at the top of `pubspec.yaml`.
   - From VS Code: Click **Get Packages** located in right side of the action ribbon at the top of `pubspec.yaml`.

## Usage

You can use Konkan Design Tokens to inform your UI specs, such as colours, spacing, typography, etc.

```dart
import 'package:konkan_ui/colors.dart';
```

```dart
Text(
  'Sample text',
  style: TextStyle(color: AppColors.baseBlack),
);
```
