import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Card, CardHeader, CardBody, CardFooter, Chip, Button, Divider, Avatar } from '@nextui-org/react';
import { Calendar, Clock, Tag, Edit, Trash, ArrowLeft, Share } from 'lucide-react';
import { apiService, Post } from '../services/apiService';

interface PostPageProps { isAuthenticated?: boolean; currentUserId?: string; }

const PostPage: React.FC<PostPageProps> = ({ isAuthenticated, currentUserId }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Post ID is required');
        const fetchedPost = await apiService.getPost(id);
        if (active) { setPost(fetchedPost); setError(null); }
      } catch {
        if (active) setError('Post could not be loaded. It may not exist or you may not have access.');
      } finally { if (active) setLoading(false); }
    };
    void fetchPost();
    return () => { active = false; };
  }, [id]);

  const isOwner = Boolean(isAuthenticated && currentUserId && post?.author?.id === currentUserId);
  const handleDelete = async () => {
    if (!post || !isOwner || !window.confirm('Are you sure you want to delete this post?')) return;
    try { setIsDeleting(true); await apiService.deletePost(post.id); navigate('/'); }
    catch { setError('Failed to delete this post. Please try again.'); setIsDeleting(false); }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post?.title, text: post?.title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setError('Link copied to clipboard.'); }
    } catch { /* Sharing was cancelled or clipboard was unavailable. */ }
  };
  const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const safeContent = (content: string) => ({ __html: DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p','strong','em','br','h1','h2','h3','ul','ol','li','blockquote','code','pre'],
    ALLOWED_ATTR: []
  }) });

  if (loading) return <div className="mx-auto max-w-4xl px-4"><Card><CardBody>Loading post…</CardBody></Card></div>;
  if (error && !post) return <div className="mx-auto max-w-4xl px-4"><Card><CardBody><p role="alert" className="text-danger">{error}</p><Button as={Link} to="/" className="mt-4" startContent={<ArrowLeft size={16} />}>Back to posts</Button></CardBody></Card></div>;

  return post ? (
    <div className="mx-auto max-w-4xl px-4">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start gap-3">
          <div className="flex w-full flex-wrap justify-between gap-2">
            <Button as={Link} to="/" variant="flat" startContent={<ArrowLeft size={16} />} size="sm">Back to posts</Button>
            <div className="flex gap-2">
              {isOwner && <><Button as={Link} to={`/posts/${post.id}/edit`} color="primary" variant="flat" startContent={<Edit size={16} />} size="sm">Edit</Button><Button color="danger" variant="flat" startContent={<Trash size={16} />} onClick={handleDelete} isLoading={isDeleting} size="sm">Delete</Button></>}
              <Button variant="flat" startContent={<Share size={16} />} onClick={handleShare} size="sm">Share</Button>
            </div>
          </div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-default-500">
            <div className="flex items-center gap-2"><Avatar name={post.author?.name} size="sm" /><span>{post.author?.name}</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} /><span>{formatDate(post.createdAt)}</span></div>
            <div className="flex items-center gap-2"><Clock size={16} /><span>{post.readingTime ?? 0} min read</span></div>
            {post.status === 'DRAFT' && <Chip color="warning">Draft</Chip>}
          </div>
        </CardHeader>
        <Divider />
        <CardBody><div className="prose max-w-none" dangerouslySetInnerHTML={safeContent(post.content)} /></CardBody>
        <CardFooter className="flex flex-col items-start gap-4"><Divider /><div className="flex flex-wrap gap-2"><Chip color="primary" variant="flat">{post.category?.name}</Chip>{post.tags?.map(tag => <Chip key={tag.id} variant="flat" startContent={<Tag size={14} />}>{tag.name}</Chip>)}</div>{error && <p role="status" className="text-sm text-default-500">{error}</p>}</CardFooter>
      </Card>
    </div>
  ) : null;
};
export default PostPage;
