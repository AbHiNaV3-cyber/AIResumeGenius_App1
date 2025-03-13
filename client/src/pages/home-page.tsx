import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Resume } from "@shared/schema";
import { Link } from "wouter";
import { Loader2, Plus, FileText, LogOut } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: resumes, isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 border-b sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume Builder AI
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600/80">Welcome, {user?.username}</span>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="backdrop-blur-sm bg-white/50 hover:bg-white/80"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Carousel */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-100/20 to-purple-100/20 rounded-3xl blur-3xl"></div>
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Create Professional Resumes with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              AI Power
            </span>
          </h2>
          <p className="text-xl text-gray-600/90 mb-12 max-w-3xl mx-auto">
            Build ATS-optimized resumes that stand out and get you hired
          </p>

          <Carousel className="max-w-4xl mx-auto mb-12">
            <CarouselContent>
              {[1, 2, 3].map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-0 shadow-xl">
                      <CardContent className="flex aspect-[16/9] items-center justify-center p-6">
                        <div className="w-full max-w-sm space-y-4 text-center">
                          <div className="p-4 bg-white/80 rounded-lg shadow-inner">
                            <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              Template {index + 1}
                            </h3>
                            <p className="text-gray-600/90 mt-2">
                              Professional and modern design optimized for ATS
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/80 backdrop-blur-sm hover:bg-white" />
            <CarouselNext className="bg-white/80 backdrop-blur-sm hover:bg-white" />
          </Carousel>

          <Link href="/builder">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-blue-800/90">AI-Powered Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700/80">
                Let AI help you craft compelling professional summaries and job descriptions
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-purple-800/90">ATS Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700/80">
                Ensure your resume passes through Applicant Tracking Systems
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-50/80 to-indigo-100/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-indigo-800/90">Professional Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-700/80">
                Choose from beautifully designed templates with customizable colors
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-800">
              Your Resumes
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : resumes?.length === 0 ? (
            <Card className="border-2 border-dashed backdrop-blur-sm bg-white/50">
              <CardContent className="py-12">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No resumes yet</h3>
                  <p className="mt-2 text-gray-600">Get started by creating your first resume</p>
                  <Link href="/builder">
                    <Button className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Create Resume
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes?.map((resume) => (
                <Card key={resume.id} className="group hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
                      {resume.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500/80 mb-4">
                      Created on {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                    <Link href={`/builder?id=${resume.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300"
                      >
                        Edit Resume
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}