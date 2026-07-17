'use client';

import React from 'react';
import { motion } from 'framer-motion';

type TextSectionContent = {
  title?: string;
  description?: string;
};

const TextSection = ({ content }: { content?: TextSectionContent | null }) => {
  if (!content) return null;

  return (
    <section className="bg-white py-24">
      <div className="pr-site-container">
        <div className="mx-auto max-w-4xl">
          {content.title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-black mb-8"
            >
              {content.title}
            </motion.h2>
          )}
          {content.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg max-w-none text-[#72665D] whitespace-pre-wrap"
            >
              {content.description}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextSection;
