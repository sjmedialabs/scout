"use client";

import { useState } from "react";
import { Plus, X,Trash2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Props {
  formData: any;
  setFormData: any;
  isEditMode: boolean;
}

export default function CaseStudiesSection({
  formData,
  setFormData,
  isEditMode,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [techInput, setTechInput] = useState("");

  const [caseStudyForm, setCaseStudyForm] = useState<any>({
    clientCompanyName: "",
    projectTitle: "",
    projectDescription: "",
    technologiesUsed: [],
    budget: "",
    timeline: "",
    stats: [],
    projectSteps: [],
    projectUrl: "",
  });

  /* ---------------- TECHNOLOGIES ---------------- */

  const addTech = () => {
    if (
      techInput.trim() &&
      !(caseStudyForm.technologiesUsed || []).includes(
        techInput
      )
    ) {
      setCaseStudyForm((prev: any) => ({
        ...prev,
        technologiesUsed: [
          ...(prev.technologiesUsed || []),
          techInput,
        ],
      }));

      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setCaseStudyForm((prev: any) => ({
      ...prev,
      technologiesUsed:
        prev.technologiesUsed.filter(
          (item: string) => item !== tech
        ),
    }));
  };

  /* ---------------- STATS ---------------- */

  const addStat = () => {
    setCaseStudyForm((prev: any) => ({
      ...prev,
      stats: [
        ...(prev.stats || []),
        { title: "", value: "", description: "" },
      ],
    }));
  };

  const updateStat = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...caseStudyForm.stats];
    updated[index][field] = value;

    setCaseStudyForm((prev: any) => ({
      ...prev,
      stats: updated,
    }));
  };

  const removeStat = (index: number) => {
    setCaseStudyForm((prev: any) => ({
      ...prev,
      stats: prev.stats.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  /* ---------------- PROJECT STEPS ---------------- */

  const addStep = () => {
    setCaseStudyForm((prev: any) => ({
      ...prev,
      projectSteps: [
        ...(prev.projectSteps || []),
        {
          title: "",
          description: "",
          timeline: "",
        },
      ],
    }));
  };

  const updateStep = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...caseStudyForm.projectSteps];
    updated[index][field] = value;

    setCaseStudyForm((prev: any) => ({
      ...prev,
      projectSteps: updated,
    }));
  };

  const removeStep = (index: number) => {
    setCaseStudyForm((prev: any) => ({
      ...prev,
      projectSteps: prev.projectSteps.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  /* ---------------- ADD / EDIT ---------------- */

  const saveCaseStudy = () => {
    if (!editId) {
      const newItem = {
        id: Date.now().toString(),
        ...caseStudyForm,
      };

      setFormData((prev: any) => ({
        ...prev,
        caseStudies: [
          ...(prev.caseStudies || []),
          newItem,
        ],
      }));
    } else {
      const updated = formData.caseStudies.map(
        (item: any) =>
          item.id === editId
            ? { ...item, ...caseStudyForm }
            : item
      );

      setFormData((prev: any) => ({
        ...prev,
        caseStudies: updated,
      }));
    }

    setCaseStudyForm({});
    setEditId(null);
    setShowForm(false);
  };

  const editCaseStudy = (id: string) => {
    const item = formData.caseStudies.find(
      (cs: any) => cs.id === id
    );

    setCaseStudyForm({ ...item });
    setEditId(id);
    setShowForm(true);
  };

  const deleteCaseStudy = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      caseStudies: prev.caseStudies.filter(
        (item: any) => item.id !== id
      ),
    }));
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="bg-white border border-[#D0D5DD] rounded-[6px]">

      <CardHeader>
        <div className="flex justify-between items-center">

          <div>
            <CardTitle>
              Case Studies
            </CardTitle>

            <CardDescription>
              Showcase detailed project case studies
            </CardDescription>
          </div>

          {isEditMode && (
            <Button
              onClick={() => setShowForm(true)}
              className="btn-blackButton h-[30px]"
            >
              <Plus className="h-4 w-4" />
              Add Case Study
            </Button>
          )}

        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* ---------------- FORM ---------------- */}

       {isEditMode && showForm && (

          <div className="space-y-4">

            {/* CLIENT */}

            <div className="space-y-2">
              <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                Client Company
              </Label>

              <Input
                value={
                  caseStudyForm.clientCompanyName || ""
                }
                onChange={(e) =>
                  setCaseStudyForm((prev: any) => ({
                    ...prev,
                    clientCompanyName:
                      e.target.value,
                  }))
                }
                placeholder="Enter client company"
                className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px] font-inter"
              />
            </div>

            {/* TITLE */}

            <div className="space-y-2">
              <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                Project Title
              </Label>

              <Input
                value={caseStudyForm.projectTitle || ""}
                onChange={(e) =>
                  setCaseStudyForm((prev: any) => ({
                    ...prev,
                    projectTitle: e.target.value,
                  }))
                }
                placeholder="Enter project title"
                className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px] font-inter"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="space-y-2">
              <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                Description
              </Label>

              <Textarea
                value={
                  caseStudyForm.projectDescription ||
                  ""
                }
                onChange={(e) =>
                  setCaseStudyForm((prev: any) => ({
                    ...prev,
                    projectDescription:
                      e.target.value,
                  }))
                }
                placeholder="Describe the project..."
                rows={3}
                className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px] font-inter"
              />
            </div>

            {/* BUDGET + TIMELINE */}

            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Budget
                </Label>

                <Input
                  value={caseStudyForm.budget || ""}
                  onChange={(e) =>
                    setCaseStudyForm(
                      (prev: any) => ({
                        ...prev,
                        budget: e.target.value,
                      })
                    )
                  }
                  placeholder="Enter budget"
                  className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Timeline
                </Label>

                <Input
                  value={
                    caseStudyForm.timeline || ""
                  }
                  onChange={(e) =>
                    setCaseStudyForm(
                      (prev: any) => ({
                        ...prev,
                        timeline: e.target.value,
                      })
                    )
                  }
                  placeholder="Enter timeline"
                  className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px]"
                />
              </div>

            </div>

            {/* TECHNOLOGIES USED */}

<div className="space-y-5 mt-4">

  <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
    Technologies Used
  </Label>

  {/* Selected Technologies */}

  <div className="flex flex-wrap gap-2">

    {(caseStudyForm.technologiesUsed || []).map(
      (tech: string) => (

        <Badge
          key={tech}
          variant="secondary"
          className="flex items-center bg-[#1C96F4] gap-2"
        >

          {tech}

          <div
            onClick={() => removeTech(tech)}
          >
            <X className="h-3 w-3 cursor-pointer" />
          </div>

        </Badge>

      )
    )}

  </div>

  {/* Add Technology Input */}

  <div className="flex w-[50%] gap-2 -mt-3">

    <Input
      type="text"
      value={techInput}
      onChange={(e) =>
        setTechInput(e.target.value)
      }
      placeholder="Enter Technology"
      className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] mt-1 border-[#D0D5DD] border-1 rounded-[6px] font-inter"
    />

    <Button
      onClick={addTech}
      className="bg-[#F54A0C] rounded-xl h-[36px] w-[70px] mt-1.5"
    >
      <Plus className="h-4 w-4" />
    </Button>

  </div>

</div>

            {/* STATS */}

            <div className="space-y-3">

              <div className="flex justify-between items-center">
                <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
                  Project Stats
                </Label>

                <Button
                  onClick={addStat}
                  className="bg-[#F54A0C] rounded-xl h-[30px]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {(caseStudyForm.stats || []).map(
                (stat: any, index: number) => (

                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2"
                  >

                    <Input
                      placeholder="Title"
                      value={stat.title}
                      onChange={(e) =>
                        updateStat(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="bg-[#f2f1f6] border-[#D0D5DD]  placeholder:text-[#b2b2b2]"
                    />

                    <Input
                      placeholder="Value"
                      value={stat.value}
                      onChange={(e) =>
                        updateStat(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                      className="bg-[#f2f1f6] border-[#D0D5DD] placeholder:text-[#b2b2b2]"
                    />

                    <Input
                      placeholder="Description"
                      value={stat.description}
                      onChange={(e) =>
                        updateStat(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="bg-[#f2f1f6] border-[#D0D5DD] placeholder:text-[#b2b2b2]"
                    />

                    <Trash2
                      className="h-5 w-5 text-red-500 cursor-pointer mt-2"
                      onClick={() =>
                        removeStat(index)
                      }
                    />

                  </div>

                )
              )}

            </div>

            {/* PROJECT STEPS */}

<div className="space-y-3 mt-4">

  <div className="flex justify-between items-center">

    <Label className="text-sm font-inter text-[#98A0B4] font-semibold">
      Project Steps
    </Label>

    <Button
      onClick={addStep}
      className="bg-[#F54A0C] rounded-xl h-[30px]"
    >
      <Plus className="h-4 w-4" />
    </Button>

  </div>

  {(caseStudyForm.projectSteps || []).map(
    (step: any, index: number) => (

      <div
        key={index}
        className="grid grid-cols-4 gap-2"
      >

        {/* Title */}

        <Input
          placeholder="Step Title"
          value={step.title}
          onChange={(e) =>
            updateStep(
              index,
              "title",
              e.target.value
            )
          }
          className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px]"
        />

        {/* Description */}

        <Input
          placeholder="Description"
          value={step.description}
          onChange={(e) =>
            updateStep(
              index,
              "description",
              e.target.value
            )
          }
          className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px]"
        />

        {/* Timeline */}

        <Input
          placeholder="Timeline"
          value={step.timeline}
          onChange={(e) =>
            updateStep(
              index,
              "timeline",
              e.target.value
            )
          }
          className="placeholder:text-[#b2b2b2] bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px]"
        />

        {/* Delete Icon */}

        <Trash2
          className="h-5 w-5 text-red-500 cursor-pointer mt-2"
          onClick={() =>
            removeStep(index)
          }
        />

      </div>

    )
  )}

</div>

            {/* ACTIONS */}

            <div className="flex gap-2">

              <Button
                onClick={saveCaseStudy}
                className="primary-button h-[30px]"
              >
                {editId
                  ? "Update Case Study"
                  : "Add Case Study"}
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setShowForm(false)
                }
                className="btn-blackButton h-[30px]"
              >
                Cancel
              </Button>

            </div>

          </div>

        )}

        {/* LIST */}

        <div className="grid md:grid-cols-2 gap-4">

          {(formData.caseStudies || []).map(
            (item: any) => (

              <div
                key={item.id}
                className="border rounded-xl p-4"
              >

                <h4 className="font-semibold">
                  {item.projectTitle}
                </h4>

                <p className="text-sm text-gray-500">
                  {item.projectDescription}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">

                  {item.technologiesUsed?.map(
                    (tech: string) => (

                      <Badge
                        key={item.id}
                        variant="secondary"
                        className="text-xs bg-[#d9e4f6] text-[#000] rounded-2xl"
                      >
                        {tech}
                      </Badge>

                    )
                  )}

                </div>

                {isEditMode && (

                  <div className="flex gap-2 mt-3">

                    <Button
                      className="primary-button h-[30px]"
                      onClick={() =>
                        deleteCaseStudy(
                          item.id
                        )
                      }
                    >
                      Delete
                    </Button>

                    <Button
                     className="btn-blackButton h-[30px]"
                      onClick={() =>
                        editCaseStudy(
                          item.id
                        )
                      }
                    >
                      Edit
                    </Button>

                  </div>

                )}

              </div>

            )
          )}

        </div>

      </CardContent>

    </Card>
  );
}