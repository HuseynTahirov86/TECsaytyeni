import { getCommentsByArticle, getUserById } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './ui/separator';

type CommentSectionProps = {
  articleSlug: string;
};

export default function CommentSection({ articleSlug }: CommentSectionProps) {
  const comments = getCommentsByArticle(articleSlug);

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 font-headline">Şərhlər ({comments.length})</h2>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className='text-lg'>Şərh yaz</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4">
                    <Textarea placeholder="Fikirlərinizi bildirin..." rows={4} />
                    <Button className='justify-self-end bg-accent hover:bg-accent/90'>Göndər</Button>
                </form>
            </CardContent>
        </Card>
        
        <Separator />

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => {
              const user = getUserById(comment.userId);
              const userAvatar = user ? PlaceHolderImages.find((img) => img.id === user.avatarId) : null;

              if (!user) return null;

              return (
                <div key={comment.id} className="flex gap-4">
                  <Avatar>
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} data-ai-hint={userAvatar.imageHint}/>}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.date}</p>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Hələ heç bir şərh yazılmayıb. İlk şərhi siz yazın!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
