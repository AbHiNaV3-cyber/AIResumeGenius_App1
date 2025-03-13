import { useEffect, useState } from "react";
import { useLocation, useLocation as useNavigate } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Resume, ResumeContent, Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ResumeForm from "@/components/resume-form";
import ResumePreview from "@/components/resume-preview";
import TemplateSelector from "@/components/template-selector";

export default function ResumeBuilder() {
  const [, setLocation] = useLocation();
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
  const [resumeContent, setResumeContent] = useState<ResumeContent | null>(null);
  const [currentTab, setCurrentTab] = useState("template");
  const { toast } = useToast();
  const [location] = useNavigate();
  const resumeId = new URLSearchParams(location.split("?")[1]).get("id");

  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: existingResume, isLoading: resumeLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", resumeId],
    enabled: !!resumeId,
  });

  const createResumeMutation = useMutation({
    mutationFn: async (data: {
      templateId: number;
      title: string;
      content: ResumeContent;
    }) => {
      const res = await apiRequest("POST", "/api/resumes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume created successfully",
      });
      setLocation("/");
    },
  });

  const generateResumeMutation = useMutation({
    mutationFn: async (data: {
      jobDescription: string;
      careerLevel: string;
      industry: string;
    }) => {
      const res = await apiRequest("POST", "/api/generate-resume", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResumeContent(data);
      setCurrentTab("edit");
    },
  });

  useEffect(() => {
    if (existingResume) {
      setSelectedTemplateId(existingResume.templateId);
      setResumeContent(existingResume.content);
      setCurrentTab("edit");
    }
  }, [existingResume]);

  if (templatesLoading || resumeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {resumeId ? "Edit Resume" : "Create New Resume"}
            </h1>
          </div>
          {resumeContent && (
            <Button
              onClick={() =>
                createResumeMutation.mutate({
                  templateId: selectedTemplateId,
                  title: resumeContent.personalInfo.fullName + "'s Resume",
                  content: resumeContent,
                })
              }
              disabled={createResumeMutation.isPending}
            >
              {createResumeMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Resume
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="template">Select Template</TabsTrigger>
              <TabsTrigger value="edit" disabled={!selectedTemplateId}>
                Edit Content
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!resumeContent}>
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template">
              <TemplateSelector
                templates={templates || []}
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
                onNext={() => setCurrentTab("edit")}
              />
            </TabsContent>

            <TabsContent value="edit">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResumeForm
                  initialContent={resumeContent}
                  onSubmit={setResumeContent}
                  onGenerate={generateResumeMutation.mutate}
                  isGenerating={generateResumeMutation.isPending}
                />
                <div className="hidden lg:block">
                  <ResumePreview
                    content={resumeContent}
                    template={
                      templates?.find((t) => t.id === selectedTemplateId)!
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <ResumePreview
                content={resumeContent}
                template={templates?.find((t) => t.id === selectedTemplateId)!}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}
