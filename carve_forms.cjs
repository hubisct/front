const fs = require('fs');

let admin = fs.readFileSync('src/app/pages/AdminPanel.tsx', 'utf8');

const s1 = admin.indexOf('// ── ENTERPRISE FORM');
const s2 = admin.indexOf('// ── USER FORM');
const s3 = admin.indexOf('// ── CATEGORY FORM');
const s4 = admin.indexOf('// ── MAIN ADMIN PANEL');

if (s1 === -1 || s2 === -1 || s3 === -1 || s4 === -1) {
  console.log('Failed to find sections', s1, s2, s3, s4);
  process.exit(1);
}

const enterpriseFormStr = admin.substring(s1, s2);
const userFormStr = admin.substring(s2, s3);
const categoryFormStr = admin.substring(s3, s4);

const sharedImports = `import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Enterprise, User, Category, CategoryItem } from "../../types";
import { Field, inputCls } from "./Field";
import { SubmitButton } from "../SubmitButton";
import { isValidEmail, isValidPassword, isValidBrazilPhone, normalizeBrazilPhone } from "../../utils/validation";
import { ImageUploadField } from "../ImageUploadField";

const btnPrimary = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]";
const btnSecondary = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all";
`;

fs.writeFileSync('src/app/components/shared/EnterpriseForm.tsx', sharedImports + '\n' + enterpriseFormStr + '\nexport { EnterpriseForm };\n');
fs.writeFileSync('src/app/components/shared/UserForm.tsx', sharedImports + '\n' + userFormStr + '\nexport { UserForm };\n');
fs.writeFileSync('src/app/components/shared/CategoryForm.tsx', sharedImports + '\n' + categoryFormStr + '\nexport { CategoryForm };\n');

// Remove from AdminPanel
admin = admin.substring(0, s1) + admin.substring(s4);

// Add imports
const importIdx = admin.indexOf('type Tab =');
admin = admin.substring(0, importIdx) + 
  `import { EnterpriseForm } from "../components/shared/EnterpriseForm";\n` +
  `import { UserForm } from "../components/shared/UserForm";\n` +
  `import { CategoryForm } from "../components/shared/CategoryForm";\n\n` +
  admin.substring(importIdx);

fs.writeFileSync('src/app/pages/AdminPanel.tsx', admin);
console.log('Successfully carved out forms');
