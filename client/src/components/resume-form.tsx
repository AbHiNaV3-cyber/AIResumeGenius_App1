import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResumeContent, resumeContentSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

interface TemplateStructure {
  colors: {
    primary: string;
    secondary: string;
    sections?: {
      summary?: string;
      experience?: string;
      education?: string;
      skills?: string;
    };
  };
}

interface Template {
  structure: TemplateStructure;
}

interface ResumeFormProps {
  initialContent: ResumeContent | null;
  template: Template;
  onSubmit: (content: ResumeContent, colors?: TemplateStructure["colors"]) => void;
  onGenerate: (data: {
    jobDescription: string;
    careerLevel: string;
    industry: string;
  }) => void;
  isGenerating: boolean;
  initialColors?: TemplateStructure["colors"];
}

export default function ResumeForm({
  initialContent,
  onSubmit,
  onGenerate,
  isGenerating,
  template,
  initialColors,
}: ResumeFormProps) {
  const [showAIForm, setShowAIForm] = useState(false);
  const [colors, setColors] = useState<TemplateStructure["colors"]>(
    initialColors || template.structure.colors
  );

  const form = useForm<ResumeContent>({
    resolver: zodResolver(resumeContentSchema),
    defaultValues: initialContent || {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
      },
      summary: "",
      experience: [
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          school: "",
          location: "",
          graduationDate: "",
        },
      ],
      skills: [],
    },
  });

  const AIForm = useForm({
    defaultValues: {
      jobDescription: "",
      careerLevel: "entry",
      industry: "technology",
    },
  });

  const handleColorChange = (key: string, value: string) => {
    setColors((prev) => ({
      ...prev,
      [key]: value,
      sections: {
        ...prev.sections,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {!showAIForm ? (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setShowAIForm(true)}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>AI Resume Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={AIForm.handleSubmit(onGenerate)}
              className="space-y-4"
            >
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...AIForm.register("jobDescription")}
                    placeholder="Paste the job description here..."
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Career Level</FormLabel>
                <Select
                  onValueChange={(value) =>
                    AIForm.setValue("careerLevel", value)
                  }
                  defaultValue={AIForm.getValues("careerLevel")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  onValueChange={(value) =>
                    AIForm.setValue("industry", value)
                  }
                  defaultValue={AIForm.getValues("industry")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAIForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Generate Resume
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(data => onSubmit(data, colors))}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="personalInfo.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="personalInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="personalInfo.location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="City, State" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Write a brief summary of your professional background..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("experience").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`experience.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`experience.${index}.startDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="month" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="month" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`experience.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.setValue("experience", [
                    ...form.getValues("experience"),
                    {
                      title: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ])
                }
              >
                Add Experience
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.watch("education").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`education.${index}.school`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`education.${index}.location`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`education.${index}.graduationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="month" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  form.setValue("education", [
                    ...form.getValues("education"),
                    {
                      degree: "",
                      school: "",
                      location: "",
                      graduationDate: "",
                    },
                  ])
                }
              >
                Add Education
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter skills separated by commas"
                        value={field.value.join(", ")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((skill) => skill.trim())
                              .filter(Boolean)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPicker
                label="Primary Color"
                value={colors.primary}
                onChange={(value) => handleColorChange("primary", value)}
              />
              <ColorPicker
                label="Secondary Color"
                value={colors.secondary}
                onChange={(value) => handleColorChange("secondary", value)}
              />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Section Colors</h3>
                <ColorPicker
                  label="Summary Section"
                  value={colors.sections?.summary || colors.secondary}
                  onChange={(value) => handleColorChange("summary", value)}
                />
                <ColorPicker
                  label="Experience Section"
                  value={colors.sections?.experience || colors.secondary}
                  onChange={(value) => handleColorChange("experience", value)}
                />
                <ColorPicker
                  label="Education Section"
                  value={colors.sections?.education || colors.secondary}
                  onChange={(value) => handleColorChange("education", value)}
                />
                <ColorPicker
                  label="Skills Section"
                  value={colors.sections?.skills || colors.secondary}
                  onChange={(value) => handleColorChange("skills", value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Update Resume
          </Button>
        </form>
      </Form>
    </div>
  );
}