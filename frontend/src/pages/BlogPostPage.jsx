// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { contentService } from '../services/contentService';

// const BlogPostPage = () => {
//     const { slug } = useParams();
//     const { data, isLoading, error } = useQuery({
//         queryKey: ['blog', slug],
//         queryFn: () => contentService.getBlogPostBySlug(slug),
//     });

//     const post = data?.data?.data;

//     if (isLoading) return <div className="container section">Loading...</div>;
//     if (error || !post) return (
//         <div className="container section">
//             <h2>Post Not Found</h2>
//             <Link to="/blog" className="btn">Back to Blog</Link>
//         </div>
//     );

//     return (
//         <main>
//             <section className="section">
//                 <div className="container" style={{ maxWidth: 800 }}>
//                     <Link to="/blog" style={{ marginBottom: 20, display: 'inline-block' }}>&larr; Back to Blog</Link>
//                     <h1>{post.title}</h1>
//                     <div style={{ color: 'gray', marginBottom: 30 }}>
//                         <span>{post.formattedDate}</span> | <span>By {post.author}</span>
//                     </div>
//                     <div style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
//                         {post.content.split('\n').map((paragraph, idx) => (
//                             <p key={idx}>{paragraph}</p>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//         </main>
//     );
// };

// export default BlogPostPage;