const router = require("express").Router();
const { supabase } = require("../Config/DbConfig");

const table = "Lead";
router.get("/", async (req, res) => {
    try {
        let { page, limit, search, status } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase.from(table).select("*", { count: "exact" });

        if (search) {
            query = query.ilike("name", `%${search}%`);
        }
        if (status) {
            query = query.eq("status", status);
        }

        const { data, count, error } = await query.range(from, to);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({
            data,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


router.get("/:id", async (req, res) => {
    const { data, error } = await supabase.from(table).select("*").eq("id", req.params.id);
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
})

router.post("/", async (req, res) => {

    const {
        name,
        email,
        phone,
        source,
        status,
    } = req.body;

    const { data, error } = await supabase.from(table).insert([
        { name, email, phone, source, status }
    ]).select();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ ...data[0] });
})

router.patch("/:id", async (req, res) => {
    const { name, email, phone, source, status } = req.body;

    // Only include provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (source !== undefined) updateData.source = source;
    if (status !== undefined) updateData.status = status;

    const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq("id", req.params.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
})

router.delete("/:id", async (req, res) => {
    const { data, error } = await supabase
        .from(table)
        .delete()
        .eq("id", req.params.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ data });
})

module.exports = router;