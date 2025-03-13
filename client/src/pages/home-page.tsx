import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Resume } from "@shared/schema";
import { Link } from "wouter";
import { Loader2, Plus, FileText, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: resumes, isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
          <Link href="/builder">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : resumes?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">You haven't created any resumes yet</p>
              <Link href="/builder">
                <Button className="mt-4">Create Your First Resume</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes?.map((resume) => (
              <Card key={resume.id}>
                <CardHeader>
                  <CardTitle>{resume.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Created on {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                  <Link href={`/builder?id=${resume.id}`}>
                    <Button variant="outline" className="w-full">
                      Edit Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
