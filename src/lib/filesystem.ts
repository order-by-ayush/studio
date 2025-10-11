
export type File = {
  type: 'file';
  content: string | (() => string | React.ReactNode);
  name: string;
  parent: Directory;
};

export type Directory = {
  type: 'directory';
  name: string;
  parent: Directory | null;
  children: { [key: string]: Directory | File };
};

export type FileSystemNode = Directory | File;

const aboutContent = `
## Digital Identity
- Name: Ayush Das
- Headline: Cybersecurity Enthusiast
- Location: Odisha, India
- Short Bio: I protect systems and data from cyber threats.
- Long Bio: I’m Ayush Das, a passionate Cybersecurity Enthusiast and BCA student focused on mastering both Offensive and Defensive Security techniques. My journey in tech began with a deep curiosity for bug hunting, ethical hacking, and OSINT investigations, which gradually evolved into building real-world cybersecurity projects that blend code, creativity, and problem-solving. I thrive on challenges and am constantly seeking opportunities to learn and grow in the ever-evolving field of cybersecurity.

---
## Education
- **Undergraduation (BCA)** | YCAT | 2026 | 8.4 SGPA
- **Higher Secondary** | The Dronacharya School | 2023 | 60%
- **High School** | Navjyoti Vidyalaya | 2021 | 84%

---
## Certifications & Courses
- Cyber Job Simulation by Deloitte
- ANZ Cyber Security Management
- Tata Cybersecurity Analyst Completion Certificate
- Mastercard Cybersecurity Completion Certificate

---
## Key Skills
- Languages: Java, C, C++, Python, HTML, CSS, JS, React, PHP
- Platforms: Linux, AWS
- Tools: Git/GitHub, API Development
`;

const projectsContent = `
Here are the highlights of some of my projects. You can find more on my GitHub.

**Packet Sniffer based on Java**
Developed a network packet sniffer in Java to capture, analyze, and display real-time network traffic, aiding in network monitoring and security analysis.

**Online Odisha eCommerce website**
Designed and developed an e-commerce platform focused on selling traditional and locally-made clothing in Odisha, supporting regional artisans and promoting traditional fashion through a user-friendly online store.

**HTTP Server for Wireless File Transfer**
Built a lightweight HTTP server to enable remote file transfer over a network without cables, allowing seamless sharing between devices using only a web browser.

**Image Encryption & Decryption Tool**
Created a secure tool to encrypt and decrypt images using custom algorithms, ensuring data privacy and protection during storage and transfer.

**Global Health Expenditure Analysis using Power BI**
Analyzed global health spending trends using data visualization and statistical methods to highlight disparities and support policy insights.

---
You can view more projects on my GitHub profile: https://github.com/aayush-xid-su
`;

const resumeContent = `
# Ayush Das
Cybersecurity Enthusiast | aayushxidsu.11am@gmail.com | +91 7894038559 | linkedin.com/in/ayushdas-11am

## SUMMARY
Passionate Cybersecurity Enthusiast and BCA student skilled in Offensive and Defensive Security. Experienced in bug hunting, ethical hacking, and OSINT. Proven ability to build real-world cybersecurity projects.

## SKILLS
- **Languages:** Java, C, C++, Python, HTML, CSS, JavaScript, React, PHP
- **Platforms:** Linux, AWS
- **Tools:** Git, GitHub, API Development, Network Analysis Tools

## PROJECTS

### Packet Sniffer (Java)
Developed a network packet sniffer to capture and analyze real-time network traffic for security monitoring.

### Online Odisha eCommerce Website
Designed an e-commerce platform for traditional Odisha clothing.

### C4Crypt & CardCrypt
Created web-based encryption tools using custom chess and card-based cipher algorithms.

### HTTP Server for Wireless File Transfer
Built a lightweight HTTP server for seamless remote file sharing.

## EDUCATION
- **Bachelor of Computer Applications (BCA)** - YCAT (Expected 2026)
- **Higher Secondary** - The Dronacharya School (2023)
- **High School** - Navjyoti Vidyalaya (2021)

## CERTIFICATIONS & COURSES
- Cyber Job Simulation by Deloitte
- ANZ Cyber Security Management
- Tata Cybersecurity Analyst
- Mastercard Cybersecurity
`;

// Define root and home first
export const root: Directory = {
    type: 'directory',
    name: '',
    parent: null,
    children: {},
};

const home: Directory = {
    type: 'directory',
    name: 'home',
    parent: root,
    children: {},
};
root.children['home'] = home;

const ayush: Directory = {
    type: 'directory',
    name: 'aayush',
    parent: home,
    children: {},
};
home.children['aayush'] = ayush;

// Define files and add them to ayush directory
const aboutFile: File = {
    type: 'file',
    name: 'about.md',
    parent: ayush,
    content: aboutContent,
};
const projectsFile: File = {
    type: 'file',
    name: 'projects.md',
    parent: ayush,
    content: projectsContent,
};
const resumeFile: File = {
    type: 'file',
    name: 'resume.md',
    parent: ayush,
    content: resumeContent,
};
ayush.children['about.md'] = aboutFile;
ayush.children['projects.md'] = projectsFile;
ayush.children['resume.md'] = resumeFile;


// Define prank folders and add them to root
const prankFolders = ['admin', 'bin', 'etc', 'usr', 'root'];
prankFolders.forEach(folderName => {
    root.children[folderName] = {
        type: 'directory',
        name: folderName,
        parent: root,
        children: {},
    };
});


// Function to find a node by path
export const findNode = (path: string, startNode: Directory = root): FileSystemNode | undefined => {
    let effectivePath = path;
    let currentNode: Directory = startNode;

    if (path.startsWith('~/')) {
        const homeNode = findNode('home/aayush', root);
        if (homeNode && homeNode.type === 'directory') {
            currentNode = homeNode;
            effectivePath = path.substring(2);
        } else {
            return undefined; // Home directory not found
        }
    } else if (path === '~') {
         const homeNode = findNode('home/aayush', root);
         return homeNode && homeNode.type === 'directory' ? homeNode : undefined;
    }


    const parts = effectivePath.split('/').filter(p => p && p !== '.');
    
    for (const part of parts) {
        if (part === '..') {
            if (currentNode.parent) {
                currentNode = currentNode.parent;
            }
            continue;
        }
        
        const nextNode = currentNode.children[part];

        if (!nextNode) {
            return undefined; // Not found
        }
        
        if (nextNode.type === 'file') {
            // If it's a file, it must be the last part of the path
            return parts.indexOf(part) === parts.length - 1 ? nextNode : undefined;
        }

        currentNode = nextNode;
    }
    return currentNode;
};


export const getPath = (node: Directory): string => {
    if (node === findNode('home/aayush')) return '~';
    if (node === root) return '/';
    
    let pathParts: string[] = [];
    let current: Directory | null = node;
    while (current && current.parent) {
        pathParts.unshift(current.name);
        current = current.parent;
    }

    const homeNode = findNode('home/aayush') as Directory;
    if (node === homeNode || pathParts.join('/').startsWith('home/aayush')) {
        const relativePath = pathParts.slice(2).join('/');
        return `~/${relativePath}`;
    }
    
    return `/${pathParts.join('/')}`;
};
