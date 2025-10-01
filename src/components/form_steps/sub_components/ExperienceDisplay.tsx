import { z } from "zod";
import { Button } from "@/components/ui/button";
import { WorkExperienceSchema } from "@/lib/types";

interface ExperienceDisplayProps {
  experience: z.infer<typeof WorkExperienceSchema>;
  onEdit: () => void;
  onRemove: () => void;
}

export function ExperienceDisplay({
  experience,
  onEdit,
  onRemove,
}: ExperienceDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          {experience.title} at {experience.company}
        </h4>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{experience.location}</p>
      <p className="text-sm text-muted-foreground">
        {experience.startDate} - {experience.endDate || "Present"}
      </p>
      {experience.description && (
        <p className="text-sm text-muted-foreground">
          {experience.description}
        </p>
      )}
    </div>
  );
}
