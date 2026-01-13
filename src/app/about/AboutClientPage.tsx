
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Target, Linkedin, Instagram, Facebook, Download, CheckCircle, ListOrdered, Goal, Scale, Handshake, Users2, ShieldCheck, GraduationCap } from "lucide-react";
import type { TeamMember } from '../ndutecnaxcivan19692025tec/team/team-form';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription as DialogDesc } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import type { FormerChairman } from '../ndutecnaxcivan19692025tec/formers/former-chairman-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AboutClientPageProps {
    teamMembers: TeamMember[];
    formerChairmen: FormerChairman[];
}

export default function AboutClientPage({ teamMembers, formerChairmen }: AboutClientPageProps) {
  const FADE_IN_ANIMATION_SETTINGS = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  const mainDirections = [
      {
        title: "Elm və tədqiqat fəaliyyətləri",
        description: "Tələbələri müxtəlif sahələrdə elmi tədqiqatlarla məşğul olmağa təşviq edir. Bu, elmi məqalələrin yazılması, layihələrin hazırlanması və digər tədqiqat fəaliyyətlərini əhatə edir.",
        icon: GraduationCap,
      },
      {
        title: "Konfrans və seminarlar",
        description: "Tələbələrə və gənc tədqiqatçılara öz araşdırmalarını təqdim etmə imkanı verən konfranslar, seminarlar, müzakirələr və digər elmi platformalar təşkil edir.",
        icon: Users2,
      },
      {
        title: "Elm və texnologiyanın populyarlaşdırılması",
        description: "Elm və texnologiyanın geniş auditoriyaya tanıdılması, elmi maarifləndirmə tədbirləri və təqdimatlarla cəmiyyətə fayda gətirir.",
        icon: CheckCircle,
      },
      {
        title: "Elmi yarışlar və layihələr",
        description: "Müxtəlif elmi və akademik mövzularda müsabiqələr, layihələr və yarışları təşkil edir. Bu fəaliyyətlər tələbələrin yaradıcı yanaşmalarını və elmi biliklərini inkişaf etdirmək üçün vacib faktorlardan biridir.",
        icon: Goal,
      },
       {
        title: "Elmi məqalə və jurnalların nəşri",
        description: "Tələbələr üçün xüsusi elmi jurnallar nəşr edir, onlar üçün müxtəlif elmi platformalar yaradır.",
        icon: CheckCircle,
      },
       {
        title: "Praktiki bacarıqların inkişafı",
        description: "Tələbələrə araşdırma metodologiyaları, statistik təhlil, yazılı və şifahi təqdimat bacarıqları kimi praktik bacarıqları öyrədir və inkişaf etdirir.",
        icon: ListOrdered,
      },
      {
        title: "Əməkdaşlıq və şəbəkələşmə",
        description: "Müxtəlif universitetlər və təşkilatlarla əməkdaşlıq əlaqələri qurur, tələbələrə şəbəkələşmə imkanı yaradır və şəbəkələşməyə xüsusi imkanlar yaradır.",
        icon: Handshake,
      },
    ];

  return (
    <motion.div 
      className="container mx-auto max-w-5xl px-4 py-12"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.2, duration: 0.8 } },
      }}
    >
      <motion.header className="text-center" variants={FADE_IN_ANIMATION_SETTINGS}>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
          TEC Haqqında
        </h1>
      </motion.header>
        
      <motion.div className="my-12" variants={FADE_IN_ANIMATION_SETTINGS}>
        <Image
          src="/tecson2.png"
          alt="TEC Komandası"
          width={1200}
          height={500}
          className="rounded-lg shadow-lg object-cover w-full"
          data-ai-hint="team meeting"
        />
      </motion.div>

       <motion.section className="mt-12 prose prose-lg max-w-none text-foreground/90" variants={FADE_IN_ANIMATION_SETTINGS}>
            <p>Tələbə Elmi Cəmiyyəti elmi tədqiqat və elmi-təşkilati işlərdə fəal iştirak edən ali təhsil pilləsinin bakalavriat və magistratura səviyyələrində, tibb təhsili sahəsində isə ali tibb təhsili müəssisələrində və rezidenturada təhsil alan tələbələrin könüllü ictimai təşkilatıdır. Tələbələrin elmi-tədqiqat işlərinin təşkili və əlaqələndirilməsi vəzifələrini Tələbə Elmi Cəmiyyəti yerinə yetirir. Tələbə Elmi Cəmiyyəti sabahın gənc tədqiqatçılarının həqiqi axtarış və yaradıcılıq məktəbidir. Eyni zamanda, bu cəmiyyət istedadlı və bacarıqlı tələbələrin üzə çıxarılmasında mühüm rol oynayır. Bu elmi arena tələbələrin nə qədər bilikli, bacarıqlı, elmə bağlı olmalarını nümayiş etdirmələri baxımından çox önəmlidir.</p>

            <p>Naxçıvan Dövlət Universitetində Tələbə Elmi Cəmiyyəti 1969-cu ildə, bu ali məktəb Azərbaycan Dövlət Pedaqoji İnstitutunun Naxçıvan filialı kimi fəaliyyət göstərdiyi dövrdən yaradılmışdır. Həmin illərdə cəmi 25 nəfər tədqiqatçı tələbəni əhatə edən cəmiyyətin üzvlərinin sayı sonralar ildən-ilə artmışdır. Hazırda Universitet Tələbə Elmi Cəmiyyəti sıralarında tələbə yaradıcılıq axtarışlarına maraq göstərən gənclər elmi-tədqiqat işləri sahəsində ilk addımlarını atmaqdadır. Hal-hazırda Tələbə Elmi Cəmiyyətinin strukturu 100 nəfər bakalavriat və magistratura pilləsində təhsil alan tələbələrdən ibarətdir.</p>
        </motion.section>

        <motion.section className="mt-16" variants={FADE_IN_ANIMATION_SETTINGS}>
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Əsas Fəaliyyət İstiqamətləri</h2>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mainDirections.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.section>
        
        <motion.section className="mt-16 prose prose-lg max-w-none text-foreground/90" variants={FADE_IN_ANIMATION_SETTINGS}>
             <h3 className="text-2xl font-bold text-primary text-center">Dəyər Prinsiplərimiz</h3>
            <ol>
                <li><strong>Elmə hörmət və maraq:</strong> Tələbə Elmi Cəmiyyəti elmə və tədqiqata olan hörmət və marağı artırmaqla yanaşı, tələbələr arasında elmə qarşı motivasiya tədbirləri görür.</li>
                <li><strong>İnkişaf və yenilikçilik:</strong> Tədqiqatçıları və tələbələri yeni biliklərə, yenilikçi yanaşmalara və müasir texnologiyalara açıq olmağa təşviq edir.</li>
                <li><strong>Əməkdaşlıq və komanda işi:</strong> Təcrübə mübadiləsi, elmi layihələrin birgə həyata keçirilməsi və müxtəlif sahələrdə biliklərin birləşdirilməsi, elmi tədqiqatların inkişafına töhfə verir.</li>
                <li><strong>Ədalət və bərabərlik:</strong> Hər bir üzvün fərqli fikirlərini və yanaşmalarını dəyərləndirərək fəaliyyət göstərir.</li>
                <li><strong>Açıq və şəffaflıq:</strong> Cəmiyyətin fəaliyyəti açıq. şəffaf, qərəzsiz və ictimai faydalı şəkildə təşkil olunur.</li>
                <li><strong>Təhsil və bilik paylaşımı:</strong> Tələbə Elmi Cəmiyyəti tələbələri bilik paylaşım və elmi mübadiləyə təşviq edir. Tələbələrin təhsil həyatını dəyişmək, onlara yeni bacarıqlar qazandırmaq və biliklərini digər üzvlərlə paylaşmaq imkanı yaradır.</li>
                <li><strong>Sosial məsuliyyət və vətəndaşlıq:</strong> Tələbə Elmi Cəmiyyəti yalnız elmi və akademik fəaliyyətlə məhdudlaşmır, eyni zamanda tələbələrin problemlərinə həll yolları tapmağa yönəlir.</li>
                <li><strong>Etika və dürüstlük:</strong> Tələbə Elmi Cəmiyyəti elmi işlərin etik prinsiplərə əsaslanaraq həyata keçirilməsinə, tədqiqatların doğruluğuna, plagiarizmin qarşısının alınmasına və elmi etikaya riayət edilməsinə təşviq edir.</li>
            </ol>
            
            <p>Tələbə Elmi Cəmiyyətinin tərkibində 4 departament (İctimaiyyətlə əlaqələr, Layihələrin idarə olunması, Tədbirlərin təşkili və İnsan resursları), 1 xidmət (Mətbuat xidməti), 12 fakültə Tələbə Elmi Cəmiyyəti və 3 klub (“Yazarlar”, “Təlimçilər” və “Şahmat”) fəaliyyət göstərir.</p>

            <p>Hər tədris ilinin başlanğıcında bütün fakültələrdə, xüsusən birinci kurslara TEC tərəfindən infosessiya keçirilərək məlumat verilir. Fakültə TEC sədrləri və üzvləri seçilir, fəaliyyətə başlanılır. Müxtəlif mövzular seçilərək tələbələrə verilir. Bu mövzular arasında Naxçıvan Muxtar Respublikasının tarixi, coğrafiyası, təbiəti, incəsənəti, görkəmli şəxsiyyətləri haqqında mövzuların seçilməsinə üstünlük verilir. Elmi-tədqiat işini işlənib-hazırlanmasında və başa çatdırmalarında tələbələrə elmi rəhbərlər köməklik edirlər. Tədris ilinin sonuna kimi tələbələr öz elmi işi üzərində çalışır, araşdırmalar aparırlar. Tədris ilinin sonuna yaxın fakültələrdə yekun konfranslar keçirilir. Elmi göstəriciləri ilə seçilən, bacarıqlı və təcrübəli tələbələr seçilərək universitet turuna buraxılırlar. Universitet turunda ən layiqli tələbələr qalib olaraq müvafiq diplomlar və hədiyyələrlə təltif olunurlar. Qaliblər Azərbaycan Respublikası Təhsil Nazirliyinin keçirdiyi tələbə elmi konfranslarında iştirak etmək hüququ qazanırlar.</p>
             <p>Naxçıvan Dövlət Universiteti Tələbə Elmi Cəmiyyətinin sədri Yusif Mirzəzadədir.</p>
             
            <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
                <Button asChild size="lg">
                    <a href="https://ndu.edu.az/public/upload/tecesasname.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Download className="mr-2 h-5 w-5" />
                        TEC Əsasnaməsi
                    </a>
                </Button>
                 <Button asChild size="lg" variant="secondary">
                    <a href="/storage/tecetik.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Download className="mr-2 h-5 w-5" />
                        Etik Davranış Kodeksi
                    </a>
                </Button>
                <Button asChild size="lg" variant="secondary">
                     <a href="https://old.bioscript.shop/uploads/ali-tehsil-muessisesinde-tehsilalanlarin-elmi-tedqiqat-isinin-teskili-haqqinda-esasname-27.06.14-emr-752-elave.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-center">
                        <Download className="mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="whitespace-normal leading-tight text-center">Təhsilalanların Elmi Tədqiqat İşi Haqqında Əsasnamə</span>
                    </a>
                </Button>
            </div>
        </motion.section>

      <motion.section className="mt-16" variants={FADE_IN_ANIMATION_SETTINGS}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Komandamızla Tanış Olun
          </h2>
          <p className="mt-2 text-muted-foreground">Təşəbbüslərimizin arxasındakı güc.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <Dialog key={member.id}>
              <DialogTrigger asChild>
                <Card className="text-center overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                    <div className="aspect-[4/5] relative w-full">
                       <img 
                          src={member.avatarUrl || "https://placehold.co/400x500.png"}
                          alt={member.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          data-ai-hint={member.avatarHint}
                        />
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-sm text-accent">{member.role}</p>
                    </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0">
                <ScrollArea className="max-h-[85vh]">
                  <div className="p-6">
                    <DialogHeader>
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={member.avatarUrl || "https://placehold.co/128x128.png"}
                          alt={member.name}
                          className="w-32 h-32 rounded-full object-cover mb-4"
                          data-ai-hint={member.avatarHint}
                        />
                        <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                        <DialogDesc className="text-accent text-base mt-1">{member.role}</DialogDesc>
                        <p className="text-sm text-muted-foreground mt-1">{member.faculty}</p>
                      </div>
                    </DialogHeader>
                    <div className="py-4 text-left">
                      <p className="text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
                    </div>
                    <div className="flex justify-center gap-4 pt-4 border-t">
                        {member.linkedinUrl && (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    <Linkedin className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}
                        {member.instagramUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={member.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                  <Instagram className="h-5 w-5" />
                              </Link>
                            </Button>
                        )}
                        {member.facebookUrl && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={member.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                  <Facebook className="h-5 w-5" />
                              </Link>
                            </Button>
                        )}
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </motion.section>

       <motion.section className="mt-16" variants={FADE_IN_ANIMATION_SETTINGS}>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Sabiq TEC Sədrləri
          </h2>
          <p className="mt-2 text-muted-foreground">Təşkilatımızın inkişafına töhfə verən liderlər.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {formerChairmen.map((chairman) => (
            <Dialog key={chairman.id}>
              <DialogTrigger asChild>
                 <Card className="text-center overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105">
                    <div className="aspect-[4/5] relative w-full">
                        <img 
                          src={chairman.avatarUrl || "https://placehold.co/400x500.png"}
                          alt={chairman.name} 
                          className="w-full h-full object-cover"
                          data-ai-hint={chairman.avatarHint}
                        />
                    </div>
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-lg">{chairman.name}</h3>
                        <p className="text-sm text-accent">{chairman.period}</p>
                    </CardContent>
                </Card>
              </DialogTrigger>
               <DialogContent className="sm:max-w-md p-0">
                <ScrollArea className="max-h-[85vh]">
                  <div className="p-6">
                    <DialogHeader>
                      <div className="flex flex-col items-center text-center">
                        <img
                          src={chairman.avatarUrl || "https://placehold.co/128x128.png"}
                          alt={chairman.name}
                          className="w-32 h-32 rounded-full object-cover mb-4"
                          data-ai-hint={chairman.avatarHint}
                        />
                        <DialogTitle className="text-2xl">{chairman.name}</DialogTitle>
                        <DialogDesc className="text-accent text-base mt-1">{chairman.period}</DialogDesc>
                      </div>
                    </DialogHeader>
                    <div className="py-4 text-left">
                      <p className="text-muted-foreground whitespace-pre-wrap">{chairman.bio}</p>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </motion.section>

    </motion.div>
  );
}

    
