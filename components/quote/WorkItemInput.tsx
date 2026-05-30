import { useRef, useState, useEffect } from "react";
import { AGNOSTIC_UNITS, METRIC_UNITS, IMPERIAL_UNITS } from "@/utils/constants";
import type { MetricSystem, IndexedWorkItem } from "@/types";
import { useQuote } from "@/hooks/useQuote";


interface CreateWorkItemProps {
    metricSystem: MetricSystem
    chapterId: string
    workItem?: IndexedWorkItem
}

export default function WorkItemInput({ metricSystem, chapterId, workItem }: CreateWorkItemProps) {
    const { upsertWorkItem, quote, deleteWorkItem, updateWorkItemCache } = useQuote()
    const units = metricSystem == "metric" ? METRIC_UNITS : IMPERIAL_UNITS
    const initialWorkItemData = {
        workitemConcept: workItem?.concept || "",
        workitemQuantity: workItem?.quantity ?? null,
        workitemUnit: workItem?.unit || "",
        workitemUnitPrice: workItem?.unitPriceInternal ?? null,
        workitemMargin: workItem?.margin ? (workItem?.margin as number * 100) : null,
    }
    const initialData = useRef(initialWorkItemData)
    const [workItemData, setWorkItemData] = useState(initialWorkItemData)

    // Debounced upsert
    useEffect(() => {
        // Skip if initial and current are the same
        const hasChanged =
            workItemData.workitemConcept !== initialData.current.workitemConcept ||
            workItemData.workitemQuantity !== initialData.current.workitemQuantity ||
            workItemData.workitemUnit !== initialData.current.workitemUnit ||
            workItemData.workitemUnitPrice !== initialData.current.workitemUnitPrice ||
            workItemData.workitemMargin !== initialData.current.workitemMargin
        if (!hasChanged) return

        if (!quote?.id) return
        if (workItemData.workitemConcept === "" || !workItemData.workitemQuantity || workItemData.workitemQuantity <= 0 || workItemData.workitemUnit === "") return

        const timer = setTimeout(async () => {
            try {
                await upsertWorkItem({
                    id: workItem?.id || undefined,
                    quoteVersionId: workItem?.id ? undefined : quote.id,
                    chapterId: workItem?.id ? undefined : chapterId,
                    concept: workItemData.workitemConcept || undefined,
                    quantity: Number(workItemData.workitemQuantity) || undefined,
                    unit: workItemData.workitemUnit || undefined,
                    unitPriceInternal: Number(workItemData.workitemUnitPrice) || undefined,
                    margin: Number(workItemData.workitemMargin) / 100 || undefined,
                })
            } catch (err) {
                console.error('Failed to upsert work item:', err)
            } finally {
                if (!workItem?.id) {
                    const reset = {
                        workitemConcept: "",
                        workitemQuantity: null,
                        workitemUnit: "",
                        workitemUnitPrice: null,
                        workitemMargin: null,
                    }
                    setWorkItemData(reset)
                    initialData.current = reset
                }
            }
        }, 3000)

        return () => {
            clearTimeout(timer)
        }
    }, [workItemData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setWorkItemData(prev => {
            const newData = { ...prev, [name]: value };

            // Math calculation
            if (workItem?.id) {
                updateWorkItemCache(workItem.id, newData, workItem);
            }

            return newData;
        });
    }


    return (
        <>
            {workItem && (
                <td>
                    <span className="workitems__number">
                        {workItem.numberedIndex}
                    </span>
                    <button
                        type="button"
                        className="workitems__delete"
                        onClick={() => deleteWorkItem(workItem.id)}
                        title={'Delete workitem ' + workItemData.workitemConcept}
                    >
                        <i className="icon-delete-outline text-24"></i>
                    </button>
                </td>
            )}
            <td>
                <input
                    type="text"
                    name="workitemConcept"
                    onChange={handleChange}
                    value={workItemData.workitemConcept}
                    aria-label={workItem ? 'Edit workitem concept' : 'Add workitem concept'}
                    placeholder="Concept"
                    autoComplete="off"
                />
            </td>
            <td>
                <input
                    type="number"
                    name="workitemQuantity"
                    onChange={handleChange}
                    value={workItemData.workitemQuantity ?? ''}
                    aria-label={workItem ? 'Edit workitem quantity' : 'Add workitem quantity'}
                    placeholder="0"
                    autoComplete="off"
                />
            </td>
            <td>
                <select
                    name="workitemUnit"
                    onChange={handleChange}
                    value={workItemData.workitemUnit}
                    aria-label={workItem ? 'Change workitem unit' : 'Select workitem unit'}
                >
                    <option value="" disabled>Select</option>
                    <optgroup label="Agnostic units">
                        {AGNOSTIC_UNITS.map(unit => <option key={unit} value={unit} >{unit}</option>)}
                    </optgroup>
                    <optgroup label={metricSystem === "metric" ? "Metric units" : "Imperial units"}>
                        {units.map(unit => <option key={unit} value={unit} >{unit}</option>)}
                    </optgroup>
                </select>
            </td>
            <td >
                <span>
                    <span className="text-disabledtext">$</span>
                    <input
                        type="number"
                        name="workitemUnitPrice"
                        onChange={handleChange}
                        value={workItemData.workitemUnitPrice ?? ''}
                        aria-label={workItem ? 'Edit workitem unit price' : 'Add workitem unit price'}
                        placeholder="0"
                    />
                    {workItemData.workitemUnit && <span className="text-disabledtext">/ {workItemData.workitemUnit}</span>}
                </span>
            </td>
            <td>
                <span className="text-disabledtext">
                    <span>$</span>
                    {workItemData.workitemQuantity && workItemData.workitemUnitPrice
                        ? Number(workItemData.workitemQuantity * workItemData.workitemUnitPrice).toFixed(2)
                        : '0.00'
                    }
                </span>
            </td>
            <td>
                <span>
                    <input
                        type="number"
                        name="workitemMargin"
                        onChange={handleChange}
                        value={workItemData.workitemMargin ?? ''}
                        aria-label={workItem ? 'Edit workitem margin' : 'Add workitem margin'}
                        placeholder="0"
                        autoComplete="off"
                    />
                    <span className="text-disabledtext">%</span>
                </span>
            </td>
            <td>
                <span className="text-disabledtext">
                    $
                    <span className="grow">
                        {workItemData.workitemQuantity && workItemData.workitemUnitPrice && workItemData.workitemMargin
                            ? Number(workItemData.workitemQuantity * workItemData.workitemUnitPrice * (1 + workItemData.workitemMargin / 100)).toFixed(2)
                            : '0.00'
                        }
                    </span>
                    {workItemData.workitemUnit && <span className="text-disabledtext">/ {workItemData.workitemUnit}</span>}
                </span>
            </td>
            <td>
                <span className="text-disabledtext">
                    <span>$</span>
                    {workItemData.workitemQuantity && workItemData.workitemUnitPrice && workItemData.workitemMargin
                        ? Number(workItemData.workitemQuantity * workItemData.workitemUnitPrice * (1 + workItemData.workitemMargin / 100)).toFixed(2)
                        : '0.00'
                    }
                </span>
            </td>
        </>
    )
}