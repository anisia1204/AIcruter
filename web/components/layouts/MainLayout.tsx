import React from 'react';
import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import ChatBot from '@/components/chat/ChatBot';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'AIcruter - AI-powered Job Recruitment Platform' 
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered job recruitment platform connecting job seekers with employers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
      
      {/* ChatBot component */}
      <ChatBot />
    </div>
  );
};

export default MainLayout;
