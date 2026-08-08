import { Form, Input, Select } from 'antd';
import { FormValues, ScraperTarget, SelectOption } from '../../types';

interface Props {
	options: SelectOption<ScraperTarget>[];
}

export function ScraperStep({ options }: Props) {
	return (
		<>
			<Form.Item<FormValues>
				label="בחירת יעד"
				name="SCRAPING_TARGET"
				rules={[{ required: true, message: 'בחר יעד סקרייפר' }]}
			>
				<Select options={options} />
			</Form.Item>
			<Form.Item<FormValues>
				label="שם משתמש"
				name="SCRAPER_USERNAME"
				rules={[{ required: true, message: 'הכנס שם משתמש' }]}
			>
				<Input
					name="scraper-username"
					autoComplete="username"
					autoCapitalize="none"
					autoCorrect="off"
					spellCheck={false}
				/>
			</Form.Item>
			<Form.Item<FormValues>
				label="סיסמה"
				name="SCRAPER_PASSWORD"
				rules={[{ required: true, message: 'הכנס סיסמה' }]}
			>
				<Input.Password name="scraper-password" autoComplete="current-password" />
			</Form.Item>
		</>
	);
}
