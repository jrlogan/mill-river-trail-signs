# The public feedback form

A spec for the Google Form linked from every sign page. Eight questions, two of
them required. It should take a person standing on the trail about ninety
seconds.

**Make one bilingual form, not two.** Put both languages in each question label.
One form means one response sheet, and the sheet is what a successor will
actually work from.

## Settings first

| Setting | Value | Why |
|---|---|---|
| Collect email addresses | **Off** | Forcing a Google sign-in loses most trail responses |
| Limit to 1 response | **Off** | Same reason |
| Response receipts | Off | Requires email collection |
| Confirmation message | See below | Tell people what happens next |

Suggested confirmation message:

> Thank you — this goes to the people who write the signs. If you left contact
> details we may follow up. / Gracias: esto llega a quienes redactan los
> letreros. Si dejó datos de contacto, es posible que le escribamos.

## The questions, in this order

Order matters. **Contact details go last** so the sheet's final columns are the
private ones, and publishing "everything except the last two columns" is a safe,
obvious rule rather than a judgement call.

### 1. Which sign is this about?

- **Type:** Dropdown
- **Required:** no — it arrives prefilled
- **Options:** the thirteen sign titles, plus *The trail generally / El sendero
  en general* and *Something else / Otra cosa*

This is the question to prefill. See *Prefilling* below.

### 2. What kind of thing is this? / ¿De qué se trata?

- **Type:** Multiple choice
- **Required:** no
- **Options:**
  - A correction — something here is wrong / Una corrección: algo está mal
  - A story or a memory / Una historia o un recuerdo
  - A photograph or document / Una fotografía o un documento
  - Something else / Otra cosa

One tap, and it makes the sheet sortable. Corrections are the ones to read first.

### 3. Tell us / Cuéntenos

- **Type:** Paragraph
- **Required:** **yes**
- **Description:** *Anything you know about this place — what was here, who
  worked here, what we got wrong. Detail is welcome. / Lo que sepa de este
  lugar: qué había aquí, quién trabajaba aquí, en qué nos equivocamos. Los
  detalles son bienvenidos.*

This is the whole point of the form. It should be the only long field.

### 4. How do you know this? / ¿Cómo lo sabe?

- **Type:** Short answer
- **Required:** no
- **Description:** *Family story, something you read, you were there — it all
  helps us know what we can print. / Una historia familiar, algo que leyó, usted
  estuvo allí: todo ayuda a saber qué podemos imprimir.*

Do not skip this one. It is the difference between a claim that can go on a
sign and a claim that has to stay on the website with a hedge. Half the trouble
in this project has come from repeating an assertion whose origin nobody
recorded.

### 5. Do you have a photograph or document? / ¿Tiene una fotografía o documento?

- **Type:** Multiple choice — *Yes / Sí*, *No*
- **Required:** no

**Do not use a file upload question.** Google requires a signed-in account to
upload, which loses exactly the people most likely to have a shoebox of
photographs. Ask yes/no and follow up by email.

### 6. May we use this? / ¿Podemos usarlo?

- **Type:** Multiple choice
- **Required:** **yes**
- **Options:**
  - Yes, and you can credit me by name / Sí, y pueden acreditarme por mi nombre
  - Yes, but keep me anonymous / Sí, pero sin mi nombre
  - No — this is just for the project / No: solo para el proyecto

This is the question that makes a public responses sheet possible without
wronging anybody. Without it you cannot publish a word of what people send.

### 7. Your name / Su nombre

- **Type:** Short answer
- **Required:** no
- **Description:** *Only used if you said we could credit you. / Solo se usa si
  autorizó que le acreditemos.*

### 8. Email or phone / Correo o teléfono

- **Type:** Short answer
- **Required:** no
- **Description:** **Never published. Only so we can follow up. / Nunca se
  publica. Solo para poder responderle.**

## Publishing the responses

If the responses sheet is published to the web:

- Publish **only** columns 1 to 6. Columns 7 and 8 are name and contact.
- Filter to rows where question 6 is not *No*.
- Where question 6 is *keep me anonymous*, do not publish the name column at
  all — which is automatic if you follow the first rule.

The safe habit: publish a separate sheet that pulls only the allowed columns,
rather than publishing the raw response sheet and trusting yourself to hide two
columns forever.

## Prefilling the sign

So a reader arriving from a sign page does not have to say which sign they are
standing at.

1. In the form editor, open the ⋮ menu and choose **Get pre-filled link**.
2. Pick any option in question 1 and press **Get link**.
3. The copied URL contains `entry.123456789=Something`. The number is what you
   need.
4. Put it in `content/_shared.yml`:

```yaml
feedback:
  url: "https://docs.google.com/forms/d/e/FORM_ID/viewform"
  sign_param: "entry.123456789"
```

Push, and every page links to the form with its own sign already selected.

## What comes back

Treat it as a queue, not an inbox. Corrections become edits to a sign's file.
Stories that check out become extra sections on a web page, and eventually
sentences on a reprinted sign. Anything you cannot verify goes on the website
with its provenance stated, not on the metal.
