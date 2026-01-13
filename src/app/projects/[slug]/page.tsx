
import type { Metadata, ResolvingMetadata } from 'next';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectArticle } from "@/app/ndutecnaxcivan19692025tec/projects/project-form";
import ProjectClientPage from './ProjectClientPage';

type Props = {
  params: { slug: string }
}

async function getProject(slug: string): Promise<ProjectArticle | null> {
    const q = query(collection(db, "projects"), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as ProjectArticle;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: 'Layihə Tapılmadı',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [
        {
          url: project.imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
        ...previousImages
      ],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Layihə Tapılmadı</h1>
        <p className="text-muted-foreground mt-2">Bu layihə mövcud deyil və ya silinib.</p>
      </div>
    );
  }

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "author": project.team.map(name => ({
      "@type": "Person",
      "name": name
    })),
     "publisher": {
        "@type": "Organization",
        "name": "NDU Tələbə Elmi Cəmiyyəti",
        "logo": {
          "@type": "ImageObject",
          "url": "https://tec.ndu.edu.az/logo1.png"
        }
    },
  };
  
  return (
     <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <ProjectClientPage project={project} />
    </>
  );
}
