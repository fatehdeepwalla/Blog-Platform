import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Input, Select, SelectItem, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { Bold, Italic, Undo, Redo, List as ListIcon, ListOrdered, ChevronDown, X } from 'lucide-react';
import { Post, Category, Tag, PostStatus } from '../services/apiService';

interface PostFormProps {
  initialPost?: Post | null;
  onSubmit: (postData: { title: string; content: string; categoryId: string; tagIds: string[]; status: PostStatus }) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
  availableTags: Tag[];
  isSubmitting?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ initialPost, onSubmit, onCancel, categories, availableTags, isSubmitting = false }) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [categoryId, setCategoryId] = useState(initialPost?.category?.id || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialPost?.tags?.map(tag => tag.id) || []);
  const [status, setStatus] = useState<PostStatus>(initialPost?.status || PostStatus.DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, orderedList: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList.configure({ keepMarks: true, keepAttributes: false }),
      OrderedList.configure({ keepMarks: true, keepAttributes: false }),
      ListItem,
    ],
    content: initialPost?.content || '',
    editorProps: { attributes: { class: 'prose max-w-none focus:outline-none min-h-[300px] px-4 py-3 border rounded-lg' } },
  });

  useEffect(() => {
    setTitle(initialPost?.title || '');
    setCategoryId(initialPost?.category?.id || '');
    setSelectedTagIds(initialPost?.tags?.map(tag => tag.id) || []);
    setStatus(initialPost?.status || PostStatus.DRAFT);
    if (editor) editor.commands.setContent(initialPost?.content || '');
  }, [initialPost, editor]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    const textContent = editor?.getText().trim() || '';
    if (!textContent) nextErrors.content = 'Content is required';
    if (!categoryId) nextErrors.category = 'Choose a category';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;
    try {
      await onSubmit({ title: title.trim(), content: editor?.getHTML() || '', categoryId, tagIds: selectedTagIds, status });
    } catch (error) {
      const apiError = error as { message?: string };
      setSubmitError(apiError.message || 'Could not save the post. Please try again.');
    }
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds(current => current.includes(id) ? current.filter(tagId => tagId !== id) : current.length < 10 ? [...current, id] : current);
  };
  const chooseHeading = (level: number) => editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run();

  return <form onSubmit={handleSubmit} className="space-y-6">
    <Card><CardBody className="space-y-5">
      <Input label="Title" value={title} onChange={event => setTitle(event.target.value)} isInvalid={!!errors.title} errorMessage={errors.title} isRequired />
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-default-100 p-2">
          <Dropdown><DropdownTrigger><Button type="button" variant="flat" size="sm" endContent={<ChevronDown size={16} />}>Heading</Button></DropdownTrigger>
            <DropdownMenu aria-label="Heading levels" onAction={key => chooseHeading(Number(key))}>
              <DropdownItem key="1">Heading 1</DropdownItem><DropdownItem key="2">Heading 2</DropdownItem><DropdownItem key="3">Heading 3</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button type="button" size="sm" isIconOnly variant="flat" aria-label="Bold" onClick={() => editor?.chain().focus().toggleBold().run()}><Bold size={16} /></Button>
          <Button type="button" size="sm" isIconOnly variant="flat" aria-label="Italic" onClick={() => editor?.chain().focus().toggleItalic().run()}><Italic size={16} /></Button>
          <Button type="button" size="sm" isIconOnly variant="flat" aria-label="Bulleted list" onClick={() => editor?.chain().focus().toggleBulletList().run()}><ListIcon size={16} /></Button>
          <Button type="button" size="sm" isIconOnly variant="flat" aria-label="Numbered list" onClick={() => editor?.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Button>
          <Button type="button" size="sm" isIconOnly variant="flat" aria-label="Undo" onClick={() => editor?.chain().focus().undo().run()} isDisabled={!editor?.can().undo()}><Undo size={16} /></Button>
          <Button type="button" size="sm" isIconOnly variant="flat" aria-label="Redo" onClick={() => editor?.chain().focus().redo().run()} isDisabled={!editor?.can().redo()}><Redo size={16} /></Button>
        </div>
        <EditorContent editor={editor} />
        {errors.content && <p className="text-sm text-danger">{errors.content}</p>}
      </div>
      <Select label="Category" selectedKeys={categoryId ? new Set([categoryId]) : new Set()} onSelectionChange={keys => setCategoryId(Array.from(keys)[0]?.toString() || '')} isInvalid={!!errors.category} errorMessage={errors.category} isRequired>
        {categories.map(category => <SelectItem key={category.id}>{category.name}</SelectItem>)}
      </Select>
      <div className="space-y-2"><p className="text-sm font-medium">Tags (up to 10)</p>
        <div className="flex flex-wrap gap-2">{availableTags.map(tag => <Chip key={tag.id} variant={selectedTagIds.includes(tag.id) ? 'solid' : 'flat'} color={selectedTagIds.includes(tag.id) ? 'primary' : 'default'} onClick={() => toggleTag(tag.id)} className="cursor-pointer">{tag.name}</Chip>)}</div>
      </div>
      <Select label="Status" selectedKeys={new Set([status])} onSelectionChange={keys => { const value = Array.from(keys)[0]?.toString(); if (value === PostStatus.DRAFT || value === PostStatus.PUBLISHED) setStatus(value); }}>
        <SelectItem key={PostStatus.DRAFT}>Draft</SelectItem><SelectItem key={PostStatus.PUBLISHED}>Published</SelectItem>
      </Select>
      {submitError && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{submitError}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" color="danger" variant="flat" onClick={onCancel} isDisabled={isSubmitting}>Cancel</Button>
        <Button color="primary" type="submit" isLoading={isSubmitting}>{initialPost ? 'Save changes' : 'Create post'}</Button>
      </div>
    </CardBody></Card>
  </form>;
};
export default PostForm;
