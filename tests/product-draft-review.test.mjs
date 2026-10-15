import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const jsx = (type, props) => ({ type, props });
function load(file, mocks) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((name) => {
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
    if (!(name in mocks)) throw new Error(`Unexpected import ${name}`);
    return mocks[name];
  }, module, module.exports);
  return module.exports.default;
}
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
}

test('saving a new draft opens the review screen without navigating or creating again', () => {
  let draftId;
  let creates = 0;
  const navigations = [];
  const Review = () => {};
  const mocks = {
    react: { useState: () => [draftId, (id) => { draftId = id; }] },
    '../../../helpers/stepValidation': { stepFields: {} },
    '../../../helpers/validateProductForm': { validateProductForm: () => ({}) },
    '@/lib/hooks/useCurrency/useCurrency': { useCurrency: () => ({ currencies: [{ code: 'NGN' }] }) },
    'next-intl': { useTranslations: () => (key) => key },
    sonner: { toast: { error: () => assert.fail('Unexpected validation error') } },
    'next/navigation': { useRouter: () => ({ replace: (path) => navigations.push(path) }) },
    'lucide-react': {},
    '@/lib/hooks/useGetAllRoutes': { useGetAllRoutes: () => ({ routes: { sellerProductDetail: (id) => `/products/${id}` } }) },
    '../../../hooks/useSellerProduct': { useSellerProduct: () => ({}) },
    '../../../hooks/useProductForm': { useProductForm: () => ({ values: { productType: 'SIMPLE', currency: 'NGN' }, validate: () => true }) },
    '../../../hooks/useProductWizardStep': { useProductWizardStep: () => ({ stepIndex: 0, isLastStep: false }) },
    '../../../hooks/useCreateProduct': { useCreateProduct: ({ onSuccess }) => ({ createProduct: () => { creates++; onSuccess('created-id'); }, isCreating: false }) },
    '../../../hooks/useUpdateProduct': { useUpdateProduct: () => ({}) },
    '../../../helpers/mapProductToFormState': {},
    '../../../constants/wizardSteps': { getWizardSteps: () => [{ key: 'images' }, { key: 'review' }] },
    '../../organisms/ProductDraftReview/ProductDraftReview': { default: Review, __esModule: true },
  };
  for (const name of [
    'next/image', '../../molecules/WizardStepper/WizardStepper',
    ...['ProductBasicInfoStep', 'ProductPricingStep', 'ProductLogisticsStep', 'ProductVariantsStep', 'ProductImagesStep', 'ProductReviewStep'].map((name) => `../../organisms/${name}/${name}`),
    '@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton',
  ]) mocks[name] = { default: () => {}, __esModule: true };
  const Wizard = load('src/features/sellerProducts/components/templates/ProductWizardTemplate/ProductWizardTemplate.tsx', mocks);
  const form = Wizard({ mode: 'create' });
  const tree = form.type(form.props);
  const next = nodes(tree).filter((node) => node.type === 'button').at(-1);
  next.props.onClick();
  assert.equal(creates, 1);
  assert.deepEqual(navigations, []);
  const review = form.type(form.props);
  assert.equal(review.type, Review);
  assert.equal(review.props.productId, 'created-id');
  assert.equal(creates, 1);
  review.props.onSubmitted();
  assert.deepEqual(navigations, ['/products/created-id']);
});

test('draft review submits for approval and navigates only on success', () => {
  const calls = [];
  let navigated = false;
  let query = { data: { id: 'draft', status: 'draft', createdAt: '2026-10-15T12:00:00Z', updatedAt: '2026-10-15T12:00:00Z' } };
  const Review = load('src/features/sellerProducts/components/organisms/ProductDraftReview/ProductDraftReview.tsx', {
    'next/link': {}, 'next-intl': { useLocale: () => 'en' }, 'lucide-react': {},
    '@/lib/hooks/useGetAllRoutes': { useGetAllRoutes: () => ({ routes: { sellerProducts: '/products' } }) },
    '../../../hooks/useSellerProduct': { useSellerProduct: () => query },
    '../../../hooks/useUpdateProductStatus': { useUpdateProductStatus: () => ({ updateStatus: (...args) => calls.push(args), isUpdatingStatus: false }) },
    '../../../helpers/mapProductToFormState': { mapProductToFormState: (value) => value },
    '../ProductReviewStep/ProductReviewStep': {},
    '@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton': {},
  });
  const props = { productId: 'draft', onSubmitted: () => { navigated = true; } };
  const tree = Review(props);
  assert.ok(nodes(tree).some((node) => node.type === 'h2' && node.props.children === 'Product history'));
  const submit = nodes(tree).find((node) => node.type === 'button');
  submit.props.onClick();
  assert.deepEqual(calls[0][0], { id: 'draft', status: 'pending_approval' });
  assert.equal(navigated, false);
  calls[0][1].onSuccess();
  assert.equal(navigated, true);
  query = { isError: true };
  assert.equal(Review(props).props.role, 'alert');
});
