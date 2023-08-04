import React from 'react';
import { createRoot } from 'react-dom/client';
import Input from 'freeform-input';

createRoot(document.getElementById('root')!).render(
  <Input value="controlled" />
);
