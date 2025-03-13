import { ResumeContent, Template, TemplateStructure } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface ResumePreviewProps {
  content: ResumeContent | null;
  template: Template;
}

export default function ResumePreview({ content, template }: ResumePreviewProps) {
  if (!content) return null;

  const structure = template.structure as TemplateStructure;
  const primaryColor = structure.colors.primary;
  const secondaryColor = structure.colors.secondary;

  return (
    <Card className="p-8 bg-white shadow-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>
            {content.personalInfo.fullName}
          </h1>
          <div className="mt-2 text-sm text-gray-600 space-x-2">
            <span>{content.personalInfo.email}</span>
            <span>•</span>
            <span>{content.personalInfo.phone}</span>
            <span>•</span>
            <span>{content.personalInfo.location}</span>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: secondaryColor }}
          >
            Professional Summary
          </h2>
          <p className="text-gray-700">{content.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: secondaryColor }}
          >
            Work Experience
          </h2>
          <div className="space-y-4">
            {content.experience.map((exp, index) => (
              <div key={index}>
                <h3 className="font-medium" style={{ color: primaryColor }}>
                  {exp.title} at {exp.company}
                </h3>
                <p className="text-sm text-gray-600">
                  {exp.location} | {exp.startDate} - {exp.endDate}
                </p>
                <p className="mt-2 text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: secondaryColor }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {content.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-medium" style={{ color: primaryColor }}>
                  {edu.degree}
                </h3>
                <p className="text-sm text-gray-600">
                  {edu.school} | {edu.location} | {edu.graduationDate}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: secondaryColor }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}