import { useState, useEffect } from "react";
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

    const [workItemData, setWorkItemData] = useState({
        workitem_concept: workItem?.concept || "",
        workitem_quantity: workItem?.quantity || 0,
        workitem_unit: workItem?.unit || "",
        workitem_unit_price: workItem?.unitPriceInternal || 0,
        workitem_margin: (workItem?.margin as number * 100) || 0,
    })

    // Debounced upsert
    useEffect(() => {
        if (!quote?.id) return
        if (workItemData.workitem_concept === "" || workItemData.workitem_quantity === 0 || workItemData.workitem_unit === "") return

        const timer = setTimeout(async () => {
            try {
                await upsertWorkItem({
                    id: workItem?.id || undefined,
                    quoteVersionId: workItem?.id ? undefined : quote.id,
                    chapterId: workItem?.id ? undefined : chapterId,
                    concept: workItemData.workitem_concept || undefined,
                    quantity: Number(workItemData.workitem_quantity) || undefined,
                    unit: workItemData.workitem_unit || undefined,
                    internalUnitPrice: Number(workItemData.workitem_unit_price) || undefined,
                    marginPercentage: Number(workItemData.workitem_margin) / 100 || undefined,
                })
            } catch (err) {
                console.error('Failed to upsert work item:', err)
            } finally {
                if (!workItem?.id) {
                    setWorkItemData({
                        workitem_concept: "",
                        workitem_quantity: 0,
                        workitem_unit: AGNOSTIC_UNITS[0],
                        workitem_unit_price: 0,
                        workitem_margin: 0,
                    })
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
                        title={'Delete workitem ' + workItemData.workitem_concept}
                    >
                        <i className="icon-delete-outline text-24"></i>
                    </button>
                </td>
            )}
            <td>
                <input
                    type="text"
                    name="workitem_concept"
                    onChange={handleChange}
                    value={workItemData.workitem_concept}
                    placeholder="Concept"
                    autoComplete="off"
                />
            </td>
            <td>
                <input
                    type="text"
                    name="workitem_quantity"
                    onChange={handleChange}
                    value={workItemData.workitem_quantity}
                    autoComplete="off"
                />
            </td>
            <td>
                <select
                    name="workitem_unit"
                    onChange={handleChange}
                    value={workItemData.workitem_unit}
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
                        type="text"
                        name="workitem_unit_price"
                        onChange={handleChange}
                        value={workItemData.workitem_unit_price}
                    />
                    {workItemData.workitem_unit && <span className="text-disabledtext">/ {workItemData.workitem_unit}</span>}
                </span>
            </td>
            <td>
                <span className="text-disabledtext">
                    <span>$</span>
                    {Number(workItemData.workitem_quantity * workItemData.workitem_unit_price).toFixed(2)}
                </span>
            </td>
            <td>
                <span>
                    <input
                        type="text"
                        name="workitem_margin"
                        onChange={handleChange}
                        value={workItemData.workitem_margin}
                        autoComplete="off"
                    />
                    <span className="text-disabledtext">%</span>
                </span>
            </td>
            <td>
                <span className="text-disabledtext">
                    $
                    <span className="grow">{Number(workItemData.workitem_quantity * workItemData.workitem_unit_price * (1 + workItemData.workitem_margin / 100)).toFixed(2)}</span>
                    {workItemData.workitem_unit && <span className="text-disabledtext">/ {workItemData.workitem_unit}</span>}
                </span>
            </td>
            <td>
                <span className="text-disabledtext">
                    <span>$</span>
                    {Number(workItemData.workitem_quantity * workItemData.workitem_unit_price * (1 + workItemData.workitem_margin / 100)).toFixed(2)}
                </span>
            </td>
        </>
    )
}