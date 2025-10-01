import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EducationItemSchema } from "@/lib/types";

interface EducationDisplayProps {
  education: z.infer<typeof EducationItemSchema>;
  onEdit: () => void;
  onRemove: () => void;
}

export function EducationDisplay({
  education,
  onEdit,
  onRemove,
}: EducationDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">
          {education.degree} in {education.field} from {education.school}
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
      <p className="text-sm text-muted-foreground">
        {education.startDate} - {education.endDate || "Present"}
      </p>
    </div>
  );
}
