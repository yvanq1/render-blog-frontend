export const categories = [
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Explore Stable Diffusion tutorials and resources'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'Learn about Midjourney AI art generation'
  },
  {
    id: 'comfyui',
    name: 'ComfyUI',
    description: 'Discover ComfyUI workflows and tips'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Explore lifestyle and wellness tips'
  },
];

export const popularTags = [
  { id: 1, name: 'SD', category: 'stable-diffusion', color: 'bg-blue-100 text-blue-800' },
  { id: 2, name: 'ControlNet', category: 'stable-diffusion', color: 'bg-indigo-100 text-indigo-800' },
  { id: 3, name: 'ComfyUI', category: 'comfyui', color: 'bg-purple-100 text-purple-800' },
  { id: 4, name: 'Workflow', category: 'comfyui', color: 'bg-pink-100 text-pink-800' },
  { id: 5, name: 'Midjourney', category: 'midjourney', color: 'bg-green-100 text-green-800' },
  { id: 6, name: 'MJ V6', category: 'midjourney', color: 'bg-emerald-100 text-emerald-800' },
  { id: 7, name: 'Prompt', category: 'other', color: 'bg-yellow-100 text-yellow-800' },
  { id: 8, name: 'Tutorial', category: 'other', color: 'bg-orange-100 text-orange-800' },
  { id: 9, name: 'Tips', category: 'other', color: 'bg-red-100 text-red-800' },
  { id: 10, name: 'Resources', category: 'other', color: 'bg-teal-100 text-teal-800' }
];

export const samplePosts = [
  {
    id: 1,
    title: 'Getting Started with Stable Diffusion',
    description: 'A comprehensive guide to setting up and using Stable Diffusion for AI image generation.',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    date: '2024-02-15',
    readTime: '5 min read',
    views: 1234,
    tags: [1, 8], // SD, Tutorial
    content: `
# Getting Started with Stable Diffusion

Stable Diffusion is a powerful AI image generation model that has revolutionized the way we create digital art. This guide will walk you through the basics of getting started with Stable Diffusion.

## Installation

First, you'll need to set up your environment...

## Basic Usage

Let's start with some simple prompts...

## Advanced Techniques

Once you're comfortable with the basics...
    `
  },
  {
    id: 2,
    title: 'Advanced ControlNet Techniques',
    description: 'Learn how to use ControlNet to create more precise and controlled image generations.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    date: '2024-02-14',
    readTime: '8 min read',
    views: 2156,
    tags: [1, 2], // SD, ControlNet
    content: `
# Advanced ControlNet Techniques

ControlNet is an innovative tool that allows for precise control over image generation...

## Understanding ControlNet

ControlNet works by...

## Common Use Cases

Here are some popular applications...
    `
  },
  {
    id: 3,
    title: 'Building Custom Workflows in ComfyUI',
    description: 'Create powerful and reusable workflows in ComfyUI for consistent results.',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    date: '2024-02-13',
    readTime: '6 min read',
    views: 1879,
    tags: [3, 4], // ComfyUI, Workflow
    content: `
# Building Custom Workflows in ComfyUI

ComfyUI offers incredible flexibility in creating custom workflows...

## Basic Workflow Structure

A typical workflow consists of...

## Advanced Nodes

Exploring advanced nodes for...
    `
  }
];
