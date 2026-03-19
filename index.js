const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));

require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post("/materias", async (req, res) => {
    const { nome } = req.body;
  
    const { data, error } = await supabase
      .from("materias")
      .insert([{ nome }]);
  
    res.json({ data, error });
  });
  
  app.get("/materias", async (req, res) => {
    const { data } = await supabase.from("materias").select("*");
    res.json(data);
  });
  
  app.delete("/materias/:id", async (req, res) => {
    const { id } = req.params;
  
    await supabase.from("materias").delete().eq("id", id);
    res.json({ ok: true });
  });

app.post("/tarefas", async (req, res) => {
  try {
    const { titulo, descricao, data_entrega, materia_id } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: "Título obrigatório" });
    }

    const { data, error } = await supabase
      .from("tarefas")
      .insert([{
        titulo,
        descricao: descricao || null,
        data_entrega,
        materia_id
      }]);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
  
  app.get("/tarefas", async (req, res) => {
    const { data } = await supabase
      .from("tarefas")
      .select("*, materias(nome)");
  
    res.json(data);
  });
  
  app.put("/tarefas/:id", async (req, res) => {
    const { id } = req.params;
    const { concluida } = req.body;
  
    await supabase
      .from("tarefas")
      .update({ concluida })
      .eq("id", id);
  
    res.json({ ok: true });
  });

  app.put("/tarefas/:id/editar", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, data_entrega, materia_id } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: "Título obrigatório" });
    }

    const { data, error } = await supabase
      .from("tarefas")
      .update({
        titulo,
        descricao,
        data_entrega,
        materia_id
      })
      .eq("id", id);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

  app.delete("/tarefas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("tarefas")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

