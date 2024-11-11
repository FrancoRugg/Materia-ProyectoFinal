import io
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle
from datetime import datetime

# Función que genera el PDF en un buffer
def create_pdf(vendor,receipt_number, items, total):
    # client_name,
    # Usa un buffer en memoria en vez de archivo físico
    buffer = io.BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter)
    
    elements = []

    # Estilos del documento
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    body_style = styles['BodyText']

    # Título del recibo
    title = Paragraph("Recibo de Pago", title_style)
    elements.append(title)

    elements.append(Paragraph("<br/><br/>", body_style))
    
    # Fecha actual
    current_date = datetime.now().strftime("%d de %B de %Y, %H:%M:%S")

    # Información del cliente
    client_info = f'''
        <b>Nombre del Vendedor:</b> {vendor}<br/>
        <b>Fecha:</b> {current_date}<br/>
        <b>Recibo No.:</b> {receipt_number}<br/>
    '''
    elements.append(Paragraph(client_info, body_style))

    elements.append(Paragraph("<br/>", body_style))

    # Datos de los artículos en formato de tabla
    data = [['Descripción', 'Cantidad', 'Precio Unitario', 'Total']]

    for item in items:
        data.append([item['description'], item['quantity'], item['unit_price'], item['total']])

    table = Table(data, colWidths=[2.5 * inch, 1 * inch, 1.5 * inch, 1.5 * inch])

    # Estilo de la tabla
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.skyblue),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(table)

    elements.append(Paragraph("<br/><br/>", body_style))

    # Total del recibo
    total_amount = f'''
        <b>Total:</b> {total}
    '''
    elements.append(Paragraph(total_amount, body_style))

    # Construir el PDF en el buffer
    pdf.build(elements)

    # Ir al inicio del buffer
    buffer.seek(0)

    # Retorna el buffer con el contenido PDF
    return buffer

# # Ejemplo de uso
# items = [
#     {'description': 'Producto A', 'quantity': 2, 'unit_price': '50.00', 'total': '100.00'},
#     {'description': 'Producto B', 'quantity': 1, 'unit_price': '30.00', 'total': '30.00'},
#     {'description': 'Producto C', 'quantity': 3, 'unit_price': '20.00', 'total': '60.00'}
# ]
# total = '190.00'

# # Genera el PDF en un buffer
# pdf_buffer = create_pdf("12345", items, total)

# # Para descargarlo o servirlo desde una web, podrías usar Flask por ejemplo
# # Guardar el archivo localmente si se desea:
# with open("recibo_pago_buffer.pdf", "wb") as f:
#     f.write(pdf_buffer.getvalue())
