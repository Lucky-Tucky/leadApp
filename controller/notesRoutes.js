const router = require("express").Router();
const { supabase } = require("../Config/DbConfig");

// Create note
router.post("/", async (req, res) => {
    const { note, lead_id } = req.body;

    const { data, error } = await supabase.from("notes").insert([
        { note, lead_id }
    ]).select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ data: data[0] });
});

router.get("/", async (req, res) => {
    try {
        const { lead_id } = req.query;
        let query = supabase.from("notes").select("*").order('created_at', { ascending: false });

        if (lead_id) {
            query = query.eq("lead_id", lead_id);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id", async (req, res) => {
    const { note } = req.body;

    const updateData = {};
    if (note !== undefined) updateData.note = note;

    const { data, error } = await supabase
        .from("notes")
        .update(updateData)
        .eq("id", req.params.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data: data[0] });
});

router.delete("/:id", async (req, res) => {
    const { data, error } = await supabase
        .from("notes")
        .delete()
        .eq("id", req.params.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data: data[0] });
});

module.exports = router;
