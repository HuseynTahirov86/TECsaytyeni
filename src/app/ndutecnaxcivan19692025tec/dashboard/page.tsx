import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        <Card>
            <CardHeader>
                <CardTitle>Xoş Gəlmisiniz!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Məzmunu idarə etmək üçün sol menyudan seçim edin.</p>
            </CardContent>
        </Card>
    </div>
  );
}
