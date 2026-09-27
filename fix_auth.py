import os

with open('frontend/src/components/AuthModal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import_replacement = '''import React, { useState } from 'react';
import { X, Lock, ArrowRight, ShieldCheck, User, Phone } from 'lucide-react';
import { register, login } from '../api';
'''
content = content.replace("import React, { useState } from 'react';\nimport { X, Lock, ArrowRight, ShieldCheck, User, Phone } from 'lucide-react';", import_replacement)

func_target = """    try {
      // Simulate API call for demo presentation
      await new Promise(r => setTimeout(r, 600));
      
      const mockUser = {
        name: name,
        phone: phone,
        is_demo: true
      };
      
      onAuthSuccess({
        user: mockUser,
        token: 'demo-token-123'
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }"""

func_replacement = """    try {
      let data;
      try {
        data = await register(phone, pin, name);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail === 'Phone number already registered.') {
          data = await login(phone, pin);
        } else {
          throw err;
        }
      }
      
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }"""

content = content.replace(func_target, func_replacement)

with open('frontend/src/components/AuthModal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
