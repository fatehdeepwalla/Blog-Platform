import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Chip, Pagination, Select, SelectItem } from '@nextui-org/react';
import { Post } from '../services/apiService';
import { Calendar, Clock, Tag } from 'lucide-react';
import DOMPurify from 'dompurify';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
  showStatus?: boolean;
}

const PAGE_SIZE = 8;
const PostList: React.FC<PostListProps> = ({ posts, loading, error, page, sortBy, onPageChange, onSortChange, showStatus = false }) => {
  const navigate = useNavigate();
  const sortOptions = [
    { value: 'createdAt,desc', label: 'Newest first' },
    { value: 'createdAt,asc', label: 'Oldest first' },
    { value: 'title,asc', label: 'Title A–Z' },
    { value: 'title,desc', label: 'Title Z–A' },
  ];
  const sortedPosts = useMemo(() => [...(posts ?? [])].sort((a, b) => {
    const [field, direction] = sortBy.split(',');
    let comparison = 0;
    if (field === 'title') comparison = a.title.localeCompare(b.title);
    else comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return direction === 'desc' ? -comparison : comparison;
  }), [posts, sortBy]);
  const totalPages = Math.max(1, Math.ceil(sortedPosts.length / PAGE_SIZE));
  const visiblePosts = sortedPosts.slice((Math.min(page, totalPages) - 1) * PAGE_SIZE, Math.min(page, totalPages) * PAGE_SIZE);
  const excerpt = (content: string) => {
    const sanitized = DOMPurify.sanitize(content, { ALLOWED_TAGS: ['p','strong','em','br','h1','h2','h3','ul','ol','li'], ALLOWED_ATTR: [] });
    const element = document.createElement('div');
    element.innerHTML = sanitized;
    const text = (element.textContent || '').trim();
    return text.length > 200 ? `${text.slice(0, 197).trimEnd()}…` : text;
  };
  if (error) return <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>;

  return <div className="w-full space-y-5">
    {!showStatus && <div className="flex justify-end"><Select aria-label="Sort posts" label="Sort by" selectedKeys={[sortBy]} className="max-w-xs" onChange={e => { onSortChange(e.target.value); onPageChange(1); }}>{sortOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</Select></div>}
    {loading ? <div className="space-y-4">{[1,2,3].map(n => <Card key={n} className="w-full animate-pulse"><CardBody><div className="mb-4 h-4 w-3/4 rounded bg-default-200" /><div className="h-4 w-1/2 rounded bg-default-200" /></CardBody></Card>)}</div> :
      visiblePosts.length === 0 ? <Card><CardBody className="py-10 text-center text-default-500">No posts found.</CardBody></Card> :
      <div className="space-y-4">{visiblePosts.map(post => <Card key={post.id} className="w-full p-2" isPressable onPress={() => navigate(`/posts/${post.id}`)}>
        <CardHeader className="flex gap-3"><div className="flex flex-col text-left"><h2 className="text-xl font-bold">{post.title}</h2><p className="text-small text-default-500">by {post.author?.name || 'Unknown author'}</p>{showStatus && <Chip className="mt-2" color="warning" size="sm">Draft</Chip>}</div></CardHeader>
        <CardBody><p className="line-clamp-3">{excerpt(post.content)}</p></CardBody>
        <CardFooter className="flex flex-wrap gap-3"><div className="flex items-center gap-1 text-small text-default-500"><Calendar size={16} />{new Date(post.createdAt).toLocaleDateString()}</div><div className="flex items-center gap-1 text-small text-default-500"><Clock size={16} />{post.readingTime ?? 0} min read</div><div className="flex flex-wrap gap-2">{post.category && <Chip color="primary" variant="flat">{post.category.name}</Chip>}{post.tags?.map(tag => <Chip key={tag.id} variant="flat" startContent={<Tag size={14} />}>{tag.name}</Chip>)}</div></CardFooter>
      </Card>)}</div>}
    {!loading && totalPages > 1 && <div className="flex justify-center"><Pagination total={totalPages} page={Math.min(page, totalPages)} onChange={onPageChange} showControls /></div>}
  </div>;
};
export default PostList;
