/**
 * PRAGATI — Seed All Data
 * ────────────────────────
 * Seeds the database with sample courses, chapters, and quizzes
 * Run: npm run seed
 */
'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

/* ═══════════════════════════════════════════════════════════════
   COURSES DATA
   ═══════════════════════════════════════════════════════════════ */
const courses = [
    {
        title: 'Data Structures & Algorithms',
        slug: 'data-structures-algorithms',
        stream: 'cs',
        degree: 'btech',
        university: 'universal',
        universalTopic: 'data-structures',
        semester: 3,
        year: 2,
        credits: 4,
        difficulty: 'intermediate',
        description: 'Master the fundamental building blocks of computer science. Learn arrays, linked lists, stacks, queues, trees, graphs, and key algorithms like sorting and searching. This course forms the backbone of technical interviews and software engineering careers.',
        icon: '🏗️',
        totalChapters: 8,
        estimatedHours: 40,
        tags: ['arrays', 'linked-list', 'stacks', 'queues', 'trees', 'graphs', 'sorting', 'searching', 'dsa'],
        category: 'Technology',
        isFeatured: true,
        rating: 4.8,
        ratingCount: 1240,
        enrollCount: 5420,
    },
    {
        title: 'Object-Oriented Programming with Java',
        slug: 'oop-java',
        stream: 'cs',
        degree: 'btech',
        university: 'universal',
        universalTopic: 'oop',
        semester: 2,
        year: 1,
        credits: 4,
        difficulty: 'beginner',
        description: 'Learn the principles of Object-Oriented Programming using Java. Covers classes, objects, inheritance, polymorphism, abstraction, encapsulation, interfaces, and exception handling.',
        icon: '☕',
        totalChapters: 6,
        estimatedHours: 30,
        tags: ['java', 'oop', 'classes', 'inheritance', 'polymorphism'],
        category: 'Technology',
        isFeatured: true,
        rating: 4.7,
        ratingCount: 890,
        enrollCount: 3200,
    },
    {
        title: 'Database Management Systems',
        slug: 'dbms',
        stream: 'cs',
        degree: 'btech',
        university: 'universal',
        universalTopic: 'dbms',
        semester: 4,
        year: 2,
        credits: 4,
        difficulty: 'intermediate',
        description: 'Comprehensive coverage of relational databases, SQL, normalization, transactions, indexing, and NoSQL concepts. Learn to design efficient database systems for real-world applications.',
        icon: '🗄️',
        totalChapters: 7,
        estimatedHours: 35,
        tags: ['sql', 'database', 'normalization', 'er-diagram', 'nosql', 'transactions'],
        category: 'Technology',
        isFeatured: true,
        rating: 4.6,
        ratingCount: 670,
        enrollCount: 2800,
    },
    {
        title: 'Web Development Fundamentals',
        slug: 'web-development-fundamentals',
        stream: 'cs',
        degree: 'btech',
        university: 'universal',
        universalTopic: 'web-dev',
        semester: 5,
        year: 3,
        credits: 3,
        difficulty: 'beginner',
        description: 'Build modern websites from scratch. Learn HTML5, CSS3, JavaScript, responsive design, and introduction to frontend frameworks. Hands-on projects included.',
        icon: '🌐',
        totalChapters: 6,
        estimatedHours: 25,
        tags: ['html', 'css', 'javascript', 'responsive', 'frontend', 'web'],
        category: 'Technology',
        isFeatured: false,
        rating: 4.9,
        ratingCount: 2100,
        enrollCount: 8900,
    },
    {
        title: 'Financial Accounting Basics',
        slug: 'financial-accounting-basics',
        stream: 'commerce',
        degree: 'bcom',
        university: 'universal',
        universalTopic: 'financial-accounting',
        semester: 1,
        year: 1,
        credits: 4,
        difficulty: 'beginner',
        description: 'Learn the fundamentals of accounting — journal entries, ledgers, trial balance, profit & loss accounts, balance sheets, and basic financial analysis. Essential for a CA, CFA, or MBA career.',
        icon: '📊',
        totalChapters: 5,
        estimatedHours: 20,
        tags: ['accounting', 'journal', 'ledger', 'balance-sheet', 'financial-statements'],
        category: 'Business',
        isFeatured: true,
        rating: 4.5,
        ratingCount: 450,
        enrollCount: 1800,
    },
    {
        title: 'Introduction to Psychology',
        slug: 'intro-psychology',
        stream: 'arts',
        degree: 'ba',
        university: 'universal',
        universalTopic: 'psychology',
        semester: 1,
        year: 1,
        credits: 3,
        difficulty: 'beginner',
        description: 'Explore the science of mind and behavior. Covers cognitive psychology, developmental psychology, social psychology, personality theories, and mental health basics.',
        icon: '🧠',
        totalChapters: 5,
        estimatedHours: 18,
        tags: ['psychology', 'cognitive', 'behavior', 'mental-health', 'personality'],
        category: 'Science',
        isFeatured: false,
        rating: 4.7,
        ratingCount: 320,
        enrollCount: 1200,
    },
    {
        title: 'Human Anatomy & Physiology',
        slug: 'human-anatomy-physiology',
        stream: 'medical',
        degree: 'mbbs',
        university: 'universal',
        universalTopic: 'anatomy',
        semester: 1,
        year: 1,
        credits: 6,
        difficulty: 'advanced',
        description: 'Detailed study of human body systems — skeletal, muscular, nervous, cardiovascular, respiratory, digestive, and endocrine systems. Foundational for all medical students.',
        icon: '🫀',
        totalChapters: 6,
        estimatedHours: 50,
        tags: ['anatomy', 'physiology', 'human-body', 'medical', 'skeletal', 'nervous-system'],
        category: 'Medical',
        isFeatured: false,
        rating: 4.8,
        ratingCount: 280,
        enrollCount: 950,
    },
    {
        title: 'Digital Marketing Strategy',
        slug: 'digital-marketing-strategy',
        stream: 'commerce',
        degree: 'bba',
        university: 'universal',
        universalTopic: 'digital-marketing',
        semester: 4,
        year: 2,
        credits: 3,
        difficulty: 'beginner',
        description: 'Master the art of online marketing — SEO, SEM, social media marketing, email campaigns, Google Analytics, and content strategy. Build a complete digital marketing plan from scratch.',
        icon: '📱',
        totalChapters: 5,
        estimatedHours: 15,
        tags: ['marketing', 'seo', 'social-media', 'google-ads', 'content-marketing'],
        category: 'Business',
        isFeatured: false,
        rating: 4.6,
        ratingCount: 890,
        enrollCount: 4200,
    },
];

/* ═══════════════════════════════════════════════════════════════
   CHAPTERS FOR "Data Structures & Algorithms"
   ═══════════════════════════════════════════════════════════════ */
const dsaChapters = [
    {
        title: 'Introduction to Data Structures',
        slug: 'intro-data-structures',
        order: 1,
        isLocked: false,
        readTimeMinutes: 15,
        summary: 'Understand what data structures are, why they matter, and how to analyze algorithm efficiency using Big-O notation.',
        content: `# Introduction to Data Structures

## What is a Data Structure?

A **data structure** is a way of organizing and storing data in a computer so that it can be accessed and modified efficiently. Different data structures are suited to different kinds of applications.

Think of it like organizing a library — you could throw all books in a pile (unstructured) or arrange them by genre, author, and title (structured). The latter lets you find any book much faster.

## Why Study Data Structures?

1. **Efficiency** — The right data structure can make your program run 100x faster
2. **Problem Solving** — Most coding problems require choosing the right data structure
3. **Interviews** — 90% of technical interviews test DSA knowledge
4. **Scalability** — Apps serving millions of users NEED efficient data structures

## Types of Data Structures

### Linear Data Structures
Data elements arranged in a sequential manner:
- **Arrays** — Fixed-size sequential collection
- **Linked Lists** — Dynamic size, connected via pointers
- **Stacks** — Last In, First Out (LIFO)
- **Queues** — First In, First Out (FIFO)

### Non-Linear Data Structures
Data elements not arranged sequentially:
- **Trees** — Hierarchical structure
- **Graphs** — Network of connected nodes
- **Hash Tables** — Key-value pair storage

## Big-O Notation

Big-O describes the **worst-case** performance of an algorithm:

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array access by index |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Recursive Fibonacci |

### Key Rules:
- Drop constants: O(2n) → O(n)
- Drop lower-order terms: O(n² + n) → O(n²)
- Always consider worst case unless stated otherwise

## Practice Tip

> Start with the simplest data structure that solves your problem. Only upgrade to a more complex one when you hit performance issues.`,
        quiz: {
            questions: [
                {
                    question: 'Which of the following is a LINEAR data structure?',
                    options: ['Tree', 'Graph', 'Stack', 'Hash Table'],
                    correctAnswer: 2,
                    explanation: 'A Stack is a linear data structure where elements are arranged sequentially. Trees and Graphs are non-linear, and Hash Tables are also non-linear.',
                },
                {
                    question: 'What is the Big-O time complexity of accessing an element in an array by index?',
                    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
                    correctAnswer: 2,
                    explanation: 'Array access by index is O(1) — constant time. You can directly jump to any position using the index.',
                },
                {
                    question: 'What does Big-O notation describe?',
                    options: ['Best-case performance', 'Average performance', 'Worst-case performance', 'Memory usage only'],
                    correctAnswer: 2,
                    explanation: 'Big-O notation typically describes the worst-case (upper bound) time complexity of an algorithm.',
                },
                {
                    question: 'O(2n + 5) simplifies to:',
                    options: ['O(2n + 5)', 'O(2n)', 'O(n)', 'O(5)'],
                    correctAnswer: 2,
                    explanation: 'In Big-O, we drop constants and lower-order terms. O(2n + 5) → O(n).',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Arrays — The Foundation',
        slug: 'arrays',
        order: 2,
        isLocked: true,
        readTimeMinutes: 20,
        summary: 'Deep dive into arrays — declaration, operations, multi-dimensional arrays, and common array algorithms.',
        content: `# Arrays — The Foundation

## What is an Array?

An **array** is a contiguous block of memory that stores elements of the **same data type**. Each element is accessed using an **index** (starting from 0 in most languages).

\`\`\`c
int arr[5] = {10, 20, 30, 40, 50};
//  Index:     0   1   2   3   4
\`\`\`

## Array Operations

### 1. Traversal — O(n)
Visit every element exactly once:
\`\`\`c
for (int i = 0; i < n; i++) {
    printf("%d ", arr[i]);
}
\`\`\`

### 2. Insertion — O(n)
To insert at position \`k\`, shift all elements from \`k\` to \`n-1\` one position right:
\`\`\`c
// Insert 25 at index 2
for (int i = n; i > 2; i--) {
    arr[i] = arr[i-1];
}
arr[2] = 25;
n++;
\`\`\`

### 3. Deletion — O(n)
To delete at position \`k\`, shift all elements from \`k+1\` to \`n-1\` one position left:
\`\`\`c
// Delete element at index 2
for (int i = 2; i < n-1; i++) {
    arr[i] = arr[i+1];
}
n--;
\`\`\`

### 4. Search
- **Linear Search** — O(n): Check each element one by one
- **Binary Search** — O(log n): Only works on sorted arrays

## Time Complexity Summary

| Operation | Best Case | Worst Case |
|-----------|-----------|------------|
| Access    | O(1)      | O(1)       |
| Search    | O(1)      | O(n)       |
| Insert    | O(1)      | O(n)       |
| Delete    | O(1)      | O(n)       |

## 2D Arrays (Matrices)

\`\`\`c
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
// Access: matrix[row][col]
printf("%d", matrix[1][2]); // Output: 6
\`\`\`

## Common Array Problems

1. **Find the maximum/minimum element** — O(n)
2. **Reverse an array** — O(n), two-pointer technique
3. **Rotate an array** — O(n), multiple approaches
4. **Two Sum problem** — O(n) with hash map
5. **Kadane's Algorithm** (Maximum Subarray Sum) — O(n)

## When to Use Arrays

✅ When you need **random access** (access by index)
✅ When size is **known and fixed**
✅ When you need **cache-friendly** sequential access

❌ When you need **frequent insertions/deletions**
❌ When the **size changes dynamically**`,
        quiz: {
            questions: [
                {
                    question: 'What is the time complexity of accessing an array element by its index?',
                    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
                    correctAnswer: 2,
                    explanation: 'Array access by index is O(1) since memory address is calculated directly.',
                },
                {
                    question: 'In a 0-indexed array arr = {10, 20, 30, 40, 50}, what is arr[3]?',
                    options: ['30', '40', '50', '20'],
                    correctAnswer: 1,
                    explanation: 'arr[0]=10, arr[1]=20, arr[2]=30, arr[3]=40.',
                },
                {
                    question: 'What is the worst-case time complexity of inserting an element at the beginning of an array?',
                    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                    correctAnswer: 2,
                    explanation: 'All existing elements must be shifted right by one position, which takes O(n).',
                },
                {
                    question: 'Binary Search requires the array to be:',
                    options: ['Empty', 'Sorted', 'Of even length', 'Containing unique elements only'],
                    correctAnswer: 1,
                    explanation: 'Binary Search only works correctly on sorted arrays.',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Linked Lists',
        slug: 'linked-lists',
        order: 3,
        isLocked: true,
        readTimeMinutes: 25,
        summary: 'Learn singly, doubly, and circular linked lists with insertion, deletion, and traversal operations.',
        content: `# Linked Lists

## What is a Linked List?

A **Linked List** is a linear data structure where elements (called **nodes**) are stored in non-contiguous memory locations. Each node contains:
1. **Data** — the actual value
2. **Pointer** — reference to the next node

\`\`\`
[Data|Next] → [Data|Next] → [Data|Next] → NULL
  Head
\`\`\`

## Types of Linked Lists

### 1. Singly Linked List
Each node points to the next node only.

\`\`\`c
struct Node {
    int data;
    struct Node* next;
};
\`\`\`

### 2. Doubly Linked List
Each node points to both the next AND previous node.

\`\`\`c
struct DNode {
    int data;
    struct DNode* prev;
    struct DNode* next;
};
\`\`\`

### 3. Circular Linked List
The last node points back to the first node (instead of NULL).

## Operations

### Insert at Beginning — O(1)
\`\`\`c
struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
newNode->data = value;
newNode->next = head;
head = newNode;
\`\`\`

### Insert at End — O(n)
Must traverse to the last node first.

### Delete a Node — O(n)
Find the node, then update the previous node's pointer.

### Search — O(n)
Must traverse from head to find an element.

## Array vs Linked List

| Feature | Array | Linked List |
|---------|-------|-------------|
| Memory | Contiguous | Scattered |
| Access | O(1) random | O(n) sequential |
| Insert at start | O(n) | O(1) |
| Insert at end | O(1) amortized | O(n) or O(1) with tail |
| Memory overhead | None | Extra pointer per node |
| Cache performance | Excellent | Poor |

## When to Use Linked Lists

✅ Frequent insertions/deletions at the beginning
✅ Unknown or frequently changing size
✅ Implementing stacks, queues, and hash tables

❌ Need for random access
❌ Memory is a concern (pointer overhead)`,
        quiz: {
            questions: [
                {
                    question: 'What is the time complexity of inserting a node at the beginning of a singly linked list?',
                    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
                    correctAnswer: 2,
                    explanation: 'Just create a new node and point it to the current head — O(1).',
                },
                {
                    question: 'In a doubly linked list, each node contains:',
                    options: ['Data and one pointer', 'Only data', 'Data and two pointers', 'Three pointers'],
                    correctAnswer: 2,
                    explanation: 'Each node has data, a pointer to the next node, and a pointer to the previous node.',
                },
                {
                    question: 'What does the last node of a singly linked list point to?',
                    options: ['Head', 'Itself', 'NULL', 'Previous node'],
                    correctAnswer: 2,
                    explanation: 'The last node in a singly linked list has its next pointer set to NULL.',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Stacks',
        slug: 'stacks',
        order: 4,
        isLocked: true,
        readTimeMinutes: 18,
        summary: 'Understand the LIFO principle, stack operations, and real-world applications like expression evaluation and undo operations.',
        content: `# Stacks

## What is a Stack?

A **Stack** is a linear data structure that follows the **LIFO** principle — **Last In, First Out**. Think of a stack of plates: you add and remove from the top only.

## Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| push(x) | Add element x to top | O(1) |
| pop() | Remove and return top element | O(1) |
| peek()/top() | View top element without removing | O(1) |
| isEmpty() | Check if stack is empty | O(1) |

## Implementation

### Using Array:
\`\`\`c
#define MAX 100
int stack[MAX];
int top = -1;

void push(int x) {
    if (top >= MAX - 1) { printf("Overflow!"); return; }
    stack[++top] = x;
}

int pop() {
    if (top < 0) { printf("Underflow!"); return -1; }
    return stack[top--];
}
\`\`\`

## Applications of Stacks

1. **Function Call Stack** — Every recursive/function call uses a stack
2. **Undo/Redo** — Text editors use stacks for undo operations
3. **Expression Evaluation** — Postfix, prefix expression evaluation
4. **Bracket Matching** — Check balanced parentheses
5. **Browser Back Button** — Navigation history
6. **DFS (Depth-First Search)** — Graph traversal uses a stack

## Infix to Postfix Conversion

Infix: \`A + B * C\`
Postfix: \`A B C * +\`

Uses operator precedence and a stack to convert expressions.`,
        quiz: {
            questions: [
                {
                    question: 'What principle does a Stack follow?',
                    options: ['FIFO', 'LIFO', 'Random Access', 'Priority Based'],
                    correctAnswer: 1,
                    explanation: 'Stack follows LIFO — Last In, First Out.',
                },
                {
                    question: 'What is the time complexity of push() operation?',
                    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
                    correctAnswer: 2,
                    explanation: 'Push adds element at the top in constant time — O(1).',
                },
                {
                    question: 'Which of the following is NOT an application of stacks?',
                    options: ['Undo operation', 'BFS traversal', 'Function calls', 'Bracket matching'],
                    correctAnswer: 1,
                    explanation: 'BFS (Breadth-First Search) uses a Queue, not a Stack. DFS uses a Stack.',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Queues',
        slug: 'queues',
        order: 5,
        isLocked: true,
        readTimeMinutes: 18,
        summary: 'Learn FIFO queues, circular queues, priority queues, and deques with their implementations and use cases.',
        content: `# Queues

## What is a Queue?

A **Queue** is a linear data structure following the **FIFO** principle — **First In, First Out**. Like a queue at a ticket counter — the person who arrives first gets served first.

## Types of Queues

1. **Simple Queue** — Basic FIFO
2. **Circular Queue** — Front and rear wrap around
3. **Priority Queue** — Elements served by priority, not order
4. **Deque (Double-Ended Queue)** — Insert/delete from both ends

## Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| enqueue(x) | Add element at rear | O(1) |
| dequeue() | Remove element from front | O(1) |
| front()/peek() | View front element | O(1) |
| isEmpty() | Check if empty | O(1) |

## Implementation

\`\`\`c
#define MAX 100
int queue[MAX];
int front = -1, rear = -1;

void enqueue(int x) {
    if (rear >= MAX - 1) { printf("Queue Full!"); return; }
    if (front == -1) front = 0;
    queue[++rear] = x;
}

int dequeue() {
    if (front == -1 || front > rear) { printf("Queue Empty!"); return -1; }
    return queue[front++];
}
\`\`\`

## Applications

1. **CPU Scheduling** — Processes waiting in a queue
2. **Print Queue** — Documents waiting to be printed
3. **BFS (Breadth-First Search)** — Graph traversal
4. **Message Queues** — Asynchronous communication
5. **Buffering** — Video/audio streaming buffers`,
        quiz: {
            questions: [
                {
                    question: 'What principle does a Queue follow?',
                    options: ['LIFO', 'FIFO', 'Random', 'Priority'],
                    correctAnswer: 1,
                    explanation: 'Queue follows FIFO — First In, First Out.',
                },
                {
                    question: 'In a circular queue, what happens when rear reaches the end?',
                    options: ['Queue overflows', 'Rear wraps to beginning', 'Front resets to 0', 'Queue empties'],
                    correctAnswer: 1,
                    explanation: 'In a circular queue, the rear wraps around to the beginning if there is space.',
                },
                {
                    question: 'Which traversal algorithm uses a Queue?',
                    options: ['DFS', 'Inorder', 'BFS', 'Preorder'],
                    correctAnswer: 2,
                    explanation: 'BFS (Breadth-First Search) uses a Queue. DFS uses a Stack.',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Trees & Binary Search Trees',
        slug: 'trees-bst',
        order: 6,
        isLocked: true,
        readTimeMinutes: 30,
        summary: 'Hierarchical data structures — binary trees, BST operations, tree traversals (inorder, preorder, postorder) and balanced trees.',
        content: `# Trees & Binary Search Trees

## What is a Tree?

A **Tree** is a non-linear, hierarchical data structure consisting of nodes connected by edges. It starts from a **root** node and branches out.

### Key Terms:
- **Root** — Topmost node
- **Parent** — Node with children
- **Child** — Node connected below a parent
- **Leaf** — Node with no children
- **Height** — Longest path from root to leaf
- **Depth** — Distance from root to a node

## Binary Tree

A tree where each node has **at most 2 children** (left and right).

\`\`\`c
struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};
\`\`\`

## Tree Traversals

### 1. Inorder (Left → Root → Right)
\`\`\`
Result for BST: Sorted order!
\`\`\`

### 2. Preorder (Root → Left → Right)
\`\`\`
Used for: Creating a copy of the tree
\`\`\`

### 3. Postorder (Left → Right → Root)
\`\`\`
Used for: Deleting a tree
\`\`\`

### 4. Level Order (BFS)
\`\`\`
Uses a queue to visit nodes level by level
\`\`\`

## Binary Search Tree (BST)

A binary tree with the **BST property**:
- Left subtree values < Node value
- Right subtree values > Node value

### BST Operations

| Operation | Average | Worst (Skewed) |
|-----------|---------|----------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

## Balanced Trees

To avoid worst-case O(n), use balanced trees:
- **AVL Tree** — Strict balancing (height difference ≤ 1)
- **Red-Black Tree** — Relaxed balancing (used in Java TreeMap, C++ map)
- **B-Tree** — Used in databases and file systems`,
        quiz: {
            questions: [
                {
                    question: 'Inorder traversal of a BST gives elements in:',
                    options: ['Random order', 'Reverse sorted order', 'Sorted (ascending) order', 'Level order'],
                    correctAnswer: 2,
                    explanation: 'Inorder traversal (Left-Root-Right) of a BST always produces elements in sorted ascending order.',
                },
                {
                    question: 'In a Binary Search Tree, for any node N:',
                    options: ['Left child > N > Right child', 'Left child < N < Right child', 'Left child = Right child', 'No specific order'],
                    correctAnswer: 1,
                    explanation: 'BST property: all left subtree values < node < all right subtree values.',
                },
                {
                    question: 'A node with no children is called a:',
                    options: ['Root', 'Parent', 'Leaf', 'Sibling'],
                    correctAnswer: 2,
                    explanation: 'A leaf node (or terminal node) has no children.',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Graphs',
        slug: 'graphs',
        order: 7,
        isLocked: true,
        readTimeMinutes: 25,
        summary: 'Graph representations, BFS, DFS, shortest path algorithms, and real-world graph applications.',
        content: `# Graphs

## What is a Graph?

A **Graph** G = (V, E) consists of a set of **vertices** (V) and **edges** (E) connecting them. Unlike trees, graphs can have cycles and there's no hierarchy.

## Types of Graphs

- **Directed** — Edges have direction (A → B)
- **Undirected** — Edges are bidirectional (A — B)
- **Weighted** — Edges have associated costs/weights
- **Cyclic/Acyclic** — Whether cycles exist

## Graph Representations

### 1. Adjacency Matrix
\`\`\`
    A  B  C
A [ 0, 1, 1 ]
B [ 1, 0, 0 ]
C [ 1, 0, 0 ]
\`\`\`
Space: O(V²) | Good for: Dense graphs

### 2. Adjacency List
\`\`\`
A → [B, C]
B → [A]
C → [A]
\`\`\`
Space: O(V + E) | Good for: Sparse graphs

## Graph Traversals

### BFS — Breadth-First Search
Uses a **Queue**. Visits all neighbors before going deeper.
- Time: O(V + E)
- Used for: Shortest path (unweighted), level-order

### DFS — Depth-First Search
Uses a **Stack** (or recursion). Goes as deep as possible first.
- Time: O(V + E)
- Used for: Cycle detection, topological sort, connected components

## Important Graph Algorithms

1. **Dijkstra's** — Shortest path (weighted, no negative edges)
2. **Bellman-Ford** — Shortest path (handles negative edges)
3. **Kruskal's / Prim's** — Minimum Spanning Tree
4. **Topological Sort** — For DAGs (Directed Acyclic Graphs)

## Real-World Applications

- Social networks (Facebook friends graph)
- Google Maps (shortest route)
- Internet (routing protocols)
- Recommendation systems`,
        quiz: {
            questions: [
                {
                    question: 'Which data structure does BFS use?',
                    options: ['Stack', 'Queue', 'Array', 'Linked List'],
                    correctAnswer: 1,
                    explanation: 'BFS uses a Queue to process nodes level by level.',
                },
                {
                    question: 'What is the space complexity of an Adjacency Matrix for a graph with V vertices?',
                    options: ['O(V)', 'O(E)', 'O(V²)', 'O(V + E)'],
                    correctAnswer: 2,
                    explanation: 'An adjacency matrix uses a V×V 2D array, so space is O(V²).',
                },
                {
                    question: 'Dijkstra\'s algorithm is used for:',
                    options: ['Finding all cycles', 'Minimum spanning tree', 'Shortest path in weighted graph', 'Topological sorting'],
                    correctAnswer: 2,
                    explanation: 'Dijkstra finds the shortest path from a source to all vertices in a weighted graph with non-negative edges.',
                },
            ],
            passingScore: 70,
        },
    },
    {
        title: 'Sorting & Searching Algorithms',
        slug: 'sorting-searching',
        order: 8,
        isLocked: true,
        readTimeMinutes: 30,
        summary: 'Comprehensive guide to sorting algorithms (bubble, selection, insertion, merge, quick sort) and searching techniques.',
        content: `# Sorting & Searching Algorithms

## Why Sorting Matters

Sorted data enables **binary search** (O(log n)), improves database queries, and is fundamental to countless algorithms.

## Comparison of Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable? |
|-----------|------|---------|-------|-------|---------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |

## Quick Sort (Most Used)

\`\`\`c
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
\`\`\`

Average: O(n log n) | In-place | Not stable

## Merge Sort (Guaranteed O(n log n))

\`\`\`c
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
\`\`\`

Always O(n log n) | Stable | Uses O(n) extra space

## Searching Algorithms

### Linear Search — O(n)
Check each element one by one. Works on unsorted arrays.

### Binary Search — O(log n)
Divide the sorted array in half repeatedly:

\`\`\`c
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1; // not found
}
\`\`\`

## Which Sorting Algorithm to Use?

- **Small data** → Insertion Sort (simple, fast for n < 50)
- **General purpose** → Quick Sort (fastest on average)
- **Need stability** → Merge Sort
- **Memory constrained** → Heap Sort or Quick Sort
- **Nearly sorted** → Insertion Sort (O(n) best case!)`,
        quiz: {
            questions: [
                {
                    question: 'Which sorting algorithm has the best worst-case time complexity?',
                    options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Selection Sort'],
                    correctAnswer: 2,
                    explanation: 'Merge Sort guarantees O(n log n) in ALL cases. Quick Sort can degrade to O(n²).',
                },
                {
                    question: 'Binary Search requires:',
                    options: ['A linked list', 'A sorted array', 'A stack', 'A hash table'],
                    correctAnswer: 1,
                    explanation: 'Binary Search only works on sorted arrays (or sorted random-access collections).',
                },
                {
                    question: 'Which sorting algorithm is NOT stable?',
                    options: ['Merge Sort', 'Insertion Sort', 'Bubble Sort', 'Quick Sort'],
                    correctAnswer: 3,
                    explanation: 'Quick Sort is not stable — equal elements may not maintain their original relative order.',
                },
                {
                    question: 'The time complexity of Binary Search is:',
                    options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
                    correctAnswer: 2,
                    explanation: 'Binary Search halves the search space each time, giving O(log n).',
                },
            ],
            passingScore: 70,
        },
    },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN SEED FUNCTION
   ═══════════════════════════════════════════════════════════════ */
async function seed() {
    await connectDB();
    console.log('\n🌱 Starting seed process...\n');

    // Clear existing data
    await Course.deleteMany({});
    await Chapter.deleteMany({});
    console.log('   🗑️  Cleared existing courses and chapters');

    // Create courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`   ✅ Created ${createdCourses.length} courses`);

    // Find the DSA course and add chapters
    const dsaCourse = createdCourses.find(c => c.slug === 'data-structures-algorithms');
    if (dsaCourse) {
        const chaptersToInsert = dsaChapters.map(ch => ({
            ...ch,
            course: dsaCourse._id,
        }));
        await Chapter.insertMany(chaptersToInsert);
        console.log(`   ✅ Created ${dsaChapters.length} chapters for DSA course`);
    }

    // Create demo admin user (if not exists)
    const adminExists = await User.findOne({ email: 'admin@pragati.com' });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash('admin123', salt);
        await User.create({
            firstName: 'Admin',
            lastName: 'Pragati',
            email: 'admin@pragati.com',
            passwordHash: hash,
            role: 'admin',
        });
        console.log('   ✅ Created admin user (admin@pragati.com / admin123)');
    }

    // Create demo student user (if not exists)
    const studentExists = await User.findOne({ email: 'student@pragati.com' });
    if (!studentExists) {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash('student123', salt);
        await User.create({
            firstName: 'Demo',
            lastName: 'Student',
            email: 'student@pragati.com',
            passwordHash: hash,
            role: 'student',
            eduLevel: '12th',
        });
        console.log('   ✅ Created demo student (student@pragati.com / student123)');
    }

    console.log('\n🎉 Seed complete! You can now start the server.\n');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
