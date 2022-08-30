import 'package:flutter/material.dart';

class AppShadows {
  static const shadowBase = BoxShadow(
    color: Color(0x1a0f0f1a),
    offset: Offset(0, 25),
    blurRadius: 50,
    spreadRadius: -12,
  );

  static const shadowBase2 = BoxShadow(
    color: Color(0x0a0f0f1a),
    offset: Offset(0, 10),
    blurRadius: 10,
    spreadRadius: -5,
  );

  AppShadows._();
}
